# TRAVELNEX – Backend Architecture & SMS Provider Integration Specification

## 1. Current Architectural Status
In the current project phase, TRAVELNEX operates entirely as a **static client-side frontend platform** using HTML5, CSS3, Vanilla JavaScript, and `LocalStorage`/`SessionStorage`. There is **no active backend server, database, or live SMS gateway** currently running.

As per security standards:
> **SMS provider API keys (such as Twilio Auth Tokens, MSG91 Authkeys) and OTP generation/verification secrets MUST NEVER be exposed in client-side frontend JavaScript.** Exposing SMS keys in frontend code allows malicious actors to drain SMS credits and spoof authentication.

---

## 2. Interactive Client-Side Simulation (Included in Frontend)
To provide a complete interactive UI flow without requiring an active backend or leaking API keys:
1. The frontend (`customer/register.html` and `customer/login.html`) includes the complete OTP verification UI:
   - 10-digit mobile number validation (`/^[6-9]\d{9}$/`).
   - "Send OTP" trigger with a **60-second cooldown timer**.
   - Rate limiting (**maximum 3 attempts** per session).
   - **5-minute expiry timer**.
   - Cryptographically random 6-digit OTP generation (`crypto.getRandomValues`).
   - Direct on-screen simulation notice displaying the exact generated OTP for demonstration:
     `[SMS Gateway Pending] OTP code is XXXXXX (Expires in 5 mins).`
   - Complete 6-digit validation preventing progression until verified.

---

## 3. Required Production Backend & SMS Provider Configuration

To enable real SMS delivery to physical mobile phones in production, deploy the following lightweight backend API:

### A. Environment Variables (`.env`)
```env
PORT=5000
NODE_ENV=production

# Choice 1: Twilio (Global & India)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx # Twilio Verify Service

# Choice 2: MSG91 (India DLT Compliant)
MSG91_AUTHKEY=your_msg91_authkey
MSG91_TEMPLATE_ID=your_dlt_approved_template_id
```

### B. Production Express.js Backend API Implementation
```javascript
// server.js
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const twilio = require('twilio');

const app = express();
app.use(express.json());
app.use(cors({ origin: 'https://your-travelnex-domain.com' }));

// Strict Rate Limiter: Max 3 OTP requests per 10 minutes per IP
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: { success: false, message: 'Too many OTP requests. Please wait 10 minutes.' }
});

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// 1. Send OTP Endpoint
app.post('/api/auth/send-otp', otpLimiter, async (req, res) => {
    const { phone } = req.body;
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ success: false, message: 'Invalid 10-digit mobile number.' });
    }

    try {
        const verification = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({ to: `+91${phone}`, channel: 'sms' });

        return res.json({ 
            success: true, 
            message: `OTP sent successfully to +91 ${phone}`,
            sessionId: verification.sid 
        });
    } catch (error) {
        console.error('Twilio Error:', error);
        return res.status(500).json({ success: false, message: 'Failed to dispatch SMS.' });
    }
});

// 2. Verify OTP Endpoint
app.post('/api/auth/verify-otp', async (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp || !/^\d{6}$/.test(otp)) {
        return res.status(400).json({ success: false, message: 'Invalid phone or 6-digit OTP.' });
    }

    try {
        const check = await client.verify.v2.services(process.env.TWILIO_SERVICE_SID)
            .verificationChecks
            .create({ to: `+91${phone}`, code: otp });

        if (check.status === 'approved') {
            return res.json({ success: true, verified: true, message: 'Phone number verified successfully.' });
        } else {
            return res.status(400).json({ success: false, message: 'Incorrect or expired OTP.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Verification service error.' });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log('TRAVELNEX Auth & SMS API listening on port 5000');
});
```

---

## 4. Connecting Frontend to the Live Backend
Once your backend is deployed:
1. Open [`assets/js/auth.js`](file:///d:/JMKC%20DESIGN/TRAVELNEX/assets/js/auth.js)
2. Set `TRAVELNEX_BACKEND_URL`:
```javascript
window.TRAVELNEX_BACKEND_URL = 'https://api.yourdomain.com';
```
3. The frontend `Auth.OTP.sendOtp()` and `Auth.OTP.verifyOtp()` methods will immediately route calls to your live backend and dispatch real carrier SMS messages.
