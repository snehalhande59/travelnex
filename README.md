# TRAVELNEX — Comprehensive Tours & Travel Management Platform

> **Live Multi-Portal Mobility Ecosystem**: Pure HTML5, CSS3, and Vanilla JavaScript architecture with reactive real-time client-side storage synchronization across Customer, Corporate, Admin, and Driver portals.

---

## 🌟 Platform Overview

**TRAVELNEX** is an enterprise-grade Tours & Travel Management Platform designed for retail travelers, families, corporate organizations, and large group events. The platform unifies 11 core mobility and travel services into a seamless, high-performance web experience.

### 🎨 Brand Identity & Theme
- **Primary Brand Color**: Royal Blue (`#07377F`)
- **Secondary Brand Color**: Navy Blue (`#0B2B63`)
- **Accent Highlight**: Golden Yellow (`#F5B51B`)
- **Backgrounds**: Pure White (`#FFFFFF`) & Soft Ice Blue (`#EAF1FA`)
- **Typography**: Outfit (Headings) & DM Sans (Body)

---

## 🚀 The Four Interconnected Portals

```
                        ┌─────────────────────────────────────┐
                        │   TRAVELNEX SHARED STORAGE LAYER    │
                        │    (Reactive LocalStorage Sync)     │
                        └───────┬─────┬─────────┬──────┬──────┘
                                │     │         │      │
       ┌────────────────────────┘     │         │      └────────────────────────┐
       ▼                              ▼         ▼                               ▼
┌───────────────┐           ┌───────────────┐ ┌───────────────┐           ┌───────────────┐
│ Customer      │           │ Corporate     │ │ Super Admin   │           │ Driver        │
│ Portal        │           │ Portal        │ │ Operations    │           │ Console       │
│               │           │               │ │               │           │               │
│ • Bookings    │           │ • Roster Mgmt │ │ • 11 Live KPIs│           │ • Trip Duty   │
│ • Invoices    │           │ • Approvals   │ │ • Fleet Dispatch│         │ • Start/Stop  │
│ • Real-time   │           │ • Net-30 GST  │ │ • Revenue     │           │ • Turn-by-Turn│
│   Status      │           │   Invoicing   │ │   Analytics   │           │ • Earnings    │
└───────────────┘           └───────────────┘ └───────────────┘           └───────────────┘
```

### 1. 🌐 Customer Portal (`customer/`)
- **Homepage (`index.html`)**: Responsive travel portal featuring hero slideshow, 3D tilted destination image stack, floating search bar, 11 mobility service cards with instant transparent pricing badges, "How It Works" 4-step guide, verified testimonials, and interactive FAQ accordion.
- **Customer Dashboard (`customer-dashboard.html`)**: 9-item sidebar, real-time KPI metrics (Total Bookings, Upcoming Trips, Completed Trips, Pending Requests), Next Upcoming Trip hero card, quick booking shortcuts, profile completion progress, and interactive bookings table with instant cancellation & invoice modal.
- **My Bookings (`my-bookings.html`)**: Filterable trip history with live status updates.

### 2. 🏢 Corporate Enterprise Portal (`corporate/`)
- **Dashboard (`corporate-dashboard.html`)**: 14-item corporate sidebar, corporate overview metrics, active employee roster, live **Add Employee** modal with local storage persistence, and one-click **Trip Approval/Rejection** workflow for employee transportation requests.
- **Roster & Invoicing (`employees.html`, `invoices.html`)**: Departmental employee directory and consolidated monthly Net-30 GST billing reports.

### 3. 🛡️ Super Admin Control Tower (`admin/`)
- **Admin Dashboard (`admin-dashboard.html`)**: 11 real-time computed KPI metrics (Total Bookings, Pending Approvals, Confirmed Trips, Completed Trips, Cancelled Trips, Total Revenue, Registered Customers, Corporate Clients, Active Drivers, Fleet Vehicles, Services).
- **Interactive Fleet Dispatch (`bookings.html`, `drivers.html`, `vehicles.html`)**: Instant driver and vehicle assignment reflecting in real time on Driver and Customer dashboards.

### 4. 🚖 Chauffeur & Driver Console (`driver/`)
- **Driver Dashboard (`driver-dashboard.html`)**: 7-item driver sidebar, real-time duty toggle (`Available`, `On Trip`, `Off Duty`), assigned trips list with direct **Start Trip** (`In Progress`) and **Complete Trip** (`Completed`) triggers that synchronize across the entire platform.

---

## 🚗 Comprehensive 11 Mobility Services

1. **Local Taxi Services** (`local-taxi.html`) — On-demand city point-to-point transfers and hourly packages.
2. **Outstation Cabs** (`outstation-cabs.html`) — Intercity one-way drops and round-trip journeys.
3. **Airport Transfers** (`airport-transfer.html`) — 24/7 flight-tracked airport pickup and drop with complimentary 45-minute waiting.
4. **Mini Bus Booking** (`mini-bus.html`) — 12 to 26-seater Force Traveller and Urbania luxury vans.
5. **Luxury Bus Booking** (`luxury-bus.html`) — 32 to 55-seater Volvo and BharatBenz air-conditioned coaches.
6. **Group Transportation** (`group-transportation.html`) — End-to-end event logistics for weddings, conferences, and sports teams.
7. **Railway Ticket Booking** (`railway-booking.html`) — Dedicated IRCTC concierge assistance and Tatkal guidance desk.
8. **Maharashtra ST Bus Booking** (`st-bus-booking.html`) — Official MSRTC reservation assistance for Shivneri Volvo, Shivshahi, and Asiad routes.
9. **Tour Packages** (`packages.html`) — Curated domestic and international holiday itineraries.
10. **Flight Booking Assistance** (`flights.html`) — Airline discovery desk and corporate air ticketing.
11. **Cruise Vacations** (`cruises.html`) — Ocean voyages and luxury river cruise bookings.

---

## 🔑 Demo Access Credentials

| Portal | URL Route | Demo User | Password / Role |
| :--- | :--- | :--- | :--- |
| **Customer** | `/customer/login.html` | `customer@travelnex.com` | Role: Retail Customer |
| **Corporate** | `/corporate/corporate-login.html` | `corporate@travelnex.com` | Role: Corporate Enterprise |
| **Super Admin** | `/admin/admin-login.html` | `admin@travelnex.com` | Role: Super Administrator |
| **Driver** | `/driver/driver-login.html` | `driver@travelnex.com` | Role: Fleet Chauffeur |

---

## 💻 Tech Stack & Architecture
- **Frontend**: HTML5 Semantic Markup, CSS3 Flexbox/Grid, CSS3 Keyframe Animations.
- **Scripting**: Vanilla JavaScript (ES6+), Clean Modular Structure.
- **State Management**: Reactive `StorageManager` (`assets/js/storage.js`) broadcasting `travelnex_storage_changed` custom events and cross-tab `storage` synchronization.
- **Zero Framework Dependency**: Instant load times, no build steps required, fully static hostable.

---
© 2026 TRAVELNEX. All Rights Reserved.
