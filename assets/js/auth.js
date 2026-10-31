/**
 * TRAVELNEX - Demo Authentication & Role Access Manager
 * Handles login, logout, registration and portal route protection.
 */

const Auth = {
    getCurrentUser() {
        try {
            const data = localStorage.getItem('travelnex_current_user');
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    },

    setCurrentUser(user) {
        if (!user) {
            localStorage.removeItem('travelnex_current_user');
        } else {
            localStorage.setItem('travelnex_current_user', JSON.stringify(user));
        }
    },

    login(email, password, expectedRole = null) {
        const users = StorageManager.get('travelnex_users', []);
        const cleanEmail = email.trim().toLowerCase();

        const user = users.find(u => u.email.toLowerCase() === cleanEmail);

        if (!user) {
            return { success: false, message: 'Invalid credentials. User not found.' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Incorrect password. Please try again.' };
        }

        if (expectedRole && user.role !== expectedRole) {
            return {
                success: false,
                message: `This account has role "${user.role.toUpperCase()}". Please log in via the ${user.role} portal.`
            };
        }

        if (user.status && user.status.toLowerCase() !== 'active') {
            return { success: false, message: 'This account has been deactivated. Contact support.' };
        }

        this.setCurrentUser(user);
        return { success: true, user };
    },

    register(userData) {
        const users = StorageManager.get('travelnex_users', []);
        const cleanEmail = userData.email.trim().toLowerCase();

        if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser = {
            id: StorageManager.generateId(userData.role === 'corporate' ? 'USR-CORP' : 'USR-CUS'),
            email: cleanEmail,
            password: userData.password,
            role: userData.role || 'customer',
            name: userData.name || '',
            phone: userData.phone || '',
            status: 'Active',
            createdAt: new Date().toISOString(),
            ...userData
        };

        users.push(newUser);
        StorageManager.set('travelnex_users', users);

        // If corporate user, also register corporate client profile
        if (newUser.role === 'corporate') {
            const newCorp = StorageManager.saveCorporateClient({
                companyName: userData.companyName || userData.name + ' Enterprise',
                email: cleanEmail,
                phone: userData.phone,
                contactPerson: userData.name,
                gstin: userData.gstin || '27AAACT9999Z1',
                address: userData.address || 'Corporate Park, Pune'
            });
            newUser.corporateId = newCorp.id;
            StorageManager.set('travelnex_users', users);
        }

        this.setCurrentUser(newUser);
        return { success: true, user: newUser };
    },

    logout(redirectUrl = null) {
        const currentUser = this.getCurrentUser();
        this.setCurrentUser(null);

        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            // Default smart redirect
            if (currentUser && currentUser.role === 'admin') {
                window.location.href = '../admin/admin-login.html';
            } else if (currentUser && currentUser.role === 'corporate') {
                window.location.href = '../corporate/corporate-login.html';
            } else if (currentUser && currentUser.role === 'driver') {
                window.location.href = '../driver/driver-login.html';
            } else {
                window.location.href = '../customer/login.html';
            }
        }
    },

    // Protected Route Guard
    requireRole(allowedRoles, redirectUrl) {
        const user = this.getCurrentUser();

        if (!user) {
            window.location.href = redirectUrl;
            return null;
        }

        const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        if (!rolesArray.includes(user.role)) {
            alert(`Unauthorized access! This page requires "${rolesArray.join(' or ')}" role. Redirecting you...`);
            window.location.href = redirectUrl;
            return null;
        }

        return user;
    },

    // Populate user details in dashboard headers/sidebars
    renderHeaderProfile() {
        const user = this.getCurrentUser();
        if (!user) return;

        const userNameEls = document.querySelectorAll('.sidebar-user-name, .header-user-name');
        userNameEls.forEach(el => el.textContent = user.name || user.email);

        const userRoleEls = document.querySelectorAll('.sidebar-user-role, .header-user-role');
        userRoleEls.forEach(el => el.textContent = user.role.toUpperCase());

        const avatarEls = document.querySelectorAll('.sidebar-user-avatar, .header-user-avatar');
        avatarEls.forEach(el => {
            const initial = (user.name || user.email || 'U').charAt(0).toUpperCase();
            el.textContent = initial;
        });
    },

    // =========================================================================
    // MOBILE NUMBER OTP VERIFICATION SERVICE
    // =========================================================================
    OTP: {
        backendUrl: window.TRAVELNEX_BACKEND_URL || null,
        sessionStoreKey: 'travelnex_otp_session',

        validatePhone(phone) {
            const clean = (phone || '').replace(/[\s\-\+]/g, '');
            const match = clean.match(/^(?:91)?([6-9]\d{9})$/);
            return match ? match[1] : null;
        },

        async sendOtp(phone) {
            const validNumber = this.validatePhone(phone);
            if (!validNumber) {
                return { success: false, message: 'Please enter a valid 10-digit Indian mobile number.' };
            }

            let session = this.getSession();
            const now = Date.now();

            if (session && session.phone === validNumber) {
                if (session.resendCooldownUntil && now < session.resendCooldownUntil) {
                    const waitSec = Math.ceil((session.resendCooldownUntil - now) / 1000);
                    return {
                        success: false,
                        message: `Please wait ${waitSec}s before requesting another OTP.`,
                        cooldownSeconds: waitSec
                    };
                }
                if (session.attempts >= 3 && now < session.expiresAt) {
                    return {
                        success: false,
                        message: 'Maximum OTP attempts reached for this session. Please wait 5 minutes.'
                    };
                }
            }

            // If a live backend endpoint is configured
            if (this.backendUrl) {
                try {
                    const res = await fetch(`${this.backendUrl}/api/auth/send-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: validNumber })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        return { success: false, message: data.message || 'SMS service error.' };
                    }
                    this.saveSession({
                        phone: validNumber,
                        sessionId: data.sessionId,
                        isLiveBackend: true,
                        resendCooldownUntil: now + 60000,
                        attempts: (session?.attempts || 0) + 1
                    });
                    return { success: true, message: 'OTP sent via SMS to ' + validNumber, isLiveBackend: true };
                } catch (e) {
                    console.warn('Backend SMS API unreachable, falling back to secure client simulation:', e);
                }
            }

            // Standalone Frontend Secure OTP Simulation
            // Generates cryptographically secure 6-digit random code
            const array = new Uint32Array(1);
            window.crypto.getRandomValues(array);
            const generatedOtp = String(100000 + (array[0] % 900000));

            const newSession = {
                phone: validNumber,
                otp: generatedOtp,
                createdAt: now,
                expiresAt: now + 5 * 60 * 1000,
                resendCooldownUntil: now + 60 * 1000,
                attempts: ((session && session.phone === validNumber) ? session.attempts : 0) + 1,
                isLiveBackend: false
            };

            this.saveSession(newSession);

            return {
                success: true,
                phone: validNumber,
                isLiveBackend: false,
                devOtp: generatedOtp,
                cooldownSeconds: 60,
                message: `[SMS Gateway Pending] OTP code is ${generatedOtp} (Expires in 5 mins).`
            };
        },

        async verifyOtp(phone, otpInput) {
            const validNumber = this.validatePhone(phone);
            const cleanOtp = (otpInput || '').trim();

            if (!validNumber) {
                return { success: false, message: 'Invalid mobile number.' };
            }
            if (!/^\d{6}$/.test(cleanOtp)) {
                return { success: false, message: 'Please enter the complete 6-digit OTP.' };
            }

            const session = this.getSession();
            if (!session || session.phone !== validNumber) {
                return { success: false, message: 'No active OTP request found for this phone number. Please click Send OTP.' };
            }

            if (session.isLiveBackend && this.backendUrl) {
                try {
                    const res = await fetch(`${this.backendUrl}/api/auth/verify-otp`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: validNumber, otp: cleanOtp, sessionId: session.sessionId })
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        return { success: false, message: data.message || 'Invalid or expired OTP.' };
                    }
                    this.clearSession();
                    return { success: true, verified: true, isLiveBackend: true };
                } catch (e) {
                    return { success: false, message: 'Backend OTP service error.' };
                }
            }

            if (Date.now() > session.expiresAt) {
                this.clearSession();
                return { success: false, message: 'OTP has expired. Please request a new OTP.' };
            }

            if (session.otp !== cleanOtp) {
                return { success: false, message: 'Incorrect OTP entered. Please try again.' };
            }

            this.clearSession();
            return { success: true, verified: true, isLiveBackend: false };
        },

        getSession() {
            try {
                const s = sessionStorage.getItem(this.sessionStoreKey);
                return s ? JSON.parse(s) : null;
            } catch (e) {
                return null;
            }
        },

        saveSession(data) {
            try {
                sessionStorage.setItem(this.sessionStoreKey, JSON.stringify(data));
            } catch (e) {}
        },

        clearSession() {
            sessionStorage.removeItem(this.sessionStoreKey);
        }
    }
};

// Auto run header profile render on DOM load
document.addEventListener('DOMContentLoaded', () => {
    Auth.renderHeaderProfile();
});
