/**
 * TRAVELNEX - Centralized LocalStorage Data Manager & Architecture
 * Manages shared data across Customer, Corporate, Admin, and Driver portals.
 */

const STORAGE_KEYS = {
    USERS: 'travelnex_users',
    BOOKINGS: 'travelnex_bookings',
    DRIVERS: 'travelnex_drivers',
    VEHICLES: 'travelnex_vehicles',
    CORPORATE_CLIENTS: 'travelnex_corporate_clients',
    EMPLOYEES: 'travelnex_employees',
    PAYMENTS: 'travelnex_payments',
    INVOICES: 'travelnex_invoices',
    SERVICES: 'travelnex_services',
    SETTINGS: 'travelnex_settings',
    NOTIFICATIONS: 'travelnex_notifications',
    CURRENT_USER: 'travelnex_current_user',
    PACKAGES: 'travelnex_packages',
    CRUISES: 'travelnex_cruises',
    FLIGHTS: 'travelnex_flights',
    ENQUIRIES: 'travelnex_enquiries',
    INITIALIZED: 'travelnex_initialized'
};

const StorageManager = {
    // Basic Storage Helpers
    get(key, defaultValue = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`Error reading ${key} from LocalStorage:`, e);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            // Dispatch a custom event for same-tab reactive updates
            window.dispatchEvent(new CustomEvent('travelnex_storage_changed', {
                detail: { key, value }
            }));
            return true;
        } catch (e) {
            console.error(`Error writing ${key} to LocalStorage:`, e);
            return false;
        }
    },

    generateId(prefix = 'TNX') {
        const rand = Math.floor(1000 + Math.random() * 9000);
        const timestamp = Date.now().toString().slice(-4);
        return `${prefix}-${timestamp}${rand}`;
    },

    // =========================================================================
    // SEED DATA INITIALIZATION
    // =========================================================================
    initSeedData(force = false) {
        if (!force && localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
            return;
        }

        // 1. Users
        const seedUsers = [
            {
                id: 'USR-ADMIN-01',
                email: 'admin@travelnex.com',
                password: 'Admin@123',
                role: 'admin',
                name: 'Chief Admin',
                phone: '+91 98220 11111',
                status: 'Active',
                createdAt: '2026-10-01T08:00:00Z'
            },
            {
                id: 'USR-CORP-01',
                email: 'corporate@travelnex.com',
                password: 'Corp@123',
                role: 'corporate',
                name: 'Rajesh Sharma',
                company: 'TechCorp Global Solutions',
                phone: '+91 98220 22222',
                corporateId: 'CORP-101',
                status: 'Active',
                createdAt: '2026-10-05T09:30:00Z'
            },
            {
                id: 'USR-DRV-01',
                email: 'driver@travelnex.com',
                password: 'Driver@123',
                role: 'driver',
                name: 'Ramesh Pawar',
                phone: '+91 98220 33333',
                driverId: 'DRV-101',
                status: 'Active',
                createdAt: '2026-10-10T11:00:00Z'
            },
            {
                id: 'USR-CUS-1001',
                email: 'customer@travelnex.com',
                password: 'User@123',
                role: 'customer',
                name: 'Aarav Patel',
                phone: '+91 98220 44444',
                status: 'Active',
                createdAt: '2026-10-15T14:20:00Z'
            }
        ];

        // 2. Corporate Clients
        const seedCorporateClients = [
            {
                id: 'CORP-101',
                companyName: 'TechCorp Global Solutions',
                email: 'corporate@travelnex.com',
                phone: '+91 98220 22222',
                contactPerson: 'Rajesh Sharma',
                gstin: '27AAACT1234F1Z1',
                address: 'Tower 4, Cybercity Magarpatta, Pune 411028',
                creditLimit: 250000,
                status: 'Approved',
                registeredAt: '2026-10-05T09:30:00Z'
            },
            {
                id: 'CORP-102',
                companyName: 'NexGen FinTech Ltd',
                email: 'p.menon@nexgen.in',
                phone: '+91 98220 55555',
                contactPerson: 'Priya Menon',
                gstin: '27AABCN5678K1Z5',
                address: 'Embassy Quadron, Hinjawadi Phase 2, Pune 411057',
                creditLimit: 150000,
                status: 'Approved',
                registeredAt: '2026-10-12T10:15:00Z'
            }
        ];

        // 3. Corporate Employees
        const seedEmployees = [
            {
                id: 'EMP-101',
                corporateId: 'CORP-101',
                name: 'Ananya Iyer',
                email: 'ananya.i@techcorp.com',
                phone: '+91 98765 11001',
                department: 'Engineering',
                designation: 'Principal Architect',
                status: 'Active',
                createdAt: '2026-10-06T10:00:00Z'
            },
            {
                id: 'EMP-102',
                corporateId: 'CORP-101',
                name: 'Vikram Malhotra',
                email: 'vikram.m@techcorp.com',
                phone: '+91 98765 11002',
                department: 'Sales & BD',
                designation: 'Regional Sales VP',
                status: 'Active',
                createdAt: '2026-10-06T10:30:00Z'
            },
            {
                id: 'EMP-103',
                corporateId: 'CORP-101',
                name: 'Sneha Kulkarni',
                email: 'sneha.k@techcorp.com',
                phone: '+91 98765 11003',
                department: 'HR & People',
                designation: 'HR Lead',
                status: 'Active',
                createdAt: '2026-10-08T12:00:00Z'
            }
        ];

        // 4. Vehicles
        const seedVehicles = [
            {
                id: 'VEH-101',
                name: 'Maruti Suzuki Dzire Prime',
                type: 'Sedan',
                regNumber: 'MH 12 AB 4501',
                seatingCapacity: 4,
                perKmRate: 14,
                status: 'Available',
                image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600',
                fuelType: 'CNG / Petrol',
                modelYear: 2024
            },
            {
                id: 'VEH-102',
                name: 'Toyota Innova Crysta ZX',
                type: 'SUV',
                regNumber: 'MH 12 CR 8820',
                seatingCapacity: 7,
                perKmRate: 21,
                status: 'Busy',
                image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600',
                fuelType: 'Diesel',
                modelYear: 2025
            },
            {
                id: 'VEH-103',
                name: 'Honda City Exclusive',
                type: 'Sedan',
                regNumber: 'MH 14 PQ 9002',
                seatingCapacity: 4,
                perKmRate: 16,
                status: 'Available',
                image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600',
                fuelType: 'Petrol',
                modelYear: 2024
            },
            {
                id: 'VEH-104',
                name: 'Mercedes-Benz E-Class Luxury',
                type: 'Luxury',
                regNumber: 'MH 12 LX 0007',
                seatingCapacity: 4,
                perKmRate: 42,
                status: 'Available',
                image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600',
                fuelType: 'Diesel',
                modelYear: 2024
            },
            {
                id: 'VEH-105',
                name: 'BharatBenz Executive Coach',
                type: 'Bus',
                regNumber: 'MH 12 TC 1144',
                seatingCapacity: 32,
                perKmRate: 55,
                status: 'Available',
                image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600',
                fuelType: 'Diesel',
                modelYear: 2023
            }
        ];

        // 5. Drivers
        const seedDrivers = [
            {
                id: 'DRV-101',
                name: 'Ramesh Pawar',
                phone: '+91 98220 33333',
                email: 'driver@travelnex.com',
                licenseNumber: 'MH12-20150044812',
                assignedVehicleId: 'VEH-101',
                availabilityStatus: 'Available',
                status: 'Active',
                rating: 4.9,
                totalTrips: 184,
                experienceYears: 9,
                joinedDate: '2023-04-10'
            },
            {
                id: 'DRV-102',
                name: 'Suresh Patil',
                phone: '+91 98220 77112',
                email: 'suresh.p@travelnex.com',
                licenseNumber: 'MH12-20170098124',
                assignedVehicleId: 'VEH-102',
                availabilityStatus: 'On Trip',
                status: 'Active',
                rating: 4.8,
                totalTrips: 142,
                experienceYears: 7,
                joinedDate: '2023-08-15'
            },
            {
                id: 'DRV-103',
                name: 'Santosh Shinde',
                phone: '+91 98220 66441',
                email: 'santosh.s@travelnex.com',
                licenseNumber: 'MH14-20180011993',
                assignedVehicleId: 'VEH-103',
                availabilityStatus: 'Available',
                status: 'Active',
                rating: 4.7,
                totalTrips: 98,
                experienceYears: 5,
                joinedDate: '2024-01-20'
            }
        ];

        // 6. Services
        const seedServices = [
            {
                id: 'SRV-01',
                name: 'Local Cab',
                slug: 'local-cab',
                description: 'On-demand point-to-point and hourly city rides with verified drivers.',
                baseFare: 150,
                perKmRate: 14,
                status: 'Active',
                icon: 'fa-taxi'
            },
            {
                id: 'SRV-02',
                name: 'Outstation',
                slug: 'outstation',
                description: 'Intercity one-way and round trips with comfortable hatchbacks, sedans and SUVs.',
                baseFare: 1500,
                perKmRate: 16,
                status: 'Active',
                icon: 'fa-route'
            },
            {
                id: 'SRV-03',
                name: 'Airport Transfer',
                slug: 'airport',
                description: 'Guaranteed on-time airport pickups and drop-offs with flight tracking.',
                baseFare: 800,
                perKmRate: 18,
                status: 'Active',
                icon: 'fa-plane-departure'
            },
            {
                id: 'SRV-04',
                name: 'Bus Rental',
                slug: 'bus-rental',
                description: 'Executive mini-buses and 32/45 seater luxury coaches for group travel and events.',
                baseFare: 4500,
                perKmRate: 55,
                status: 'Active',
                icon: 'fa-bus'
            },
            {
                id: 'SRV-05',
                name: 'Train Booking',
                slug: 'train-booking',
                description: 'Express train enquiry, seat availability assistance and demo itinerary management.',
                baseFare: 250,
                perKmRate: 2,
                status: 'Active',
                icon: 'fa-train'
            },
            {
                id: 'SRV-06',
                name: 'ST Bus Booking',
                slug: 'st-bus',
                description: 'State Transport & intercity bus reservation assistance across major routes.',
                baseFare: 120,
                perKmRate: 3,
                status: 'Active',
                icon: 'fa-bus-simple'
            }
        ];

        // 7. Common Unified Bookings
        const seedBookings = [
            {
                id: 'TNX-BOOKING-1001',
                customerId: 'USR-CUS-1001',
                corporateId: null,
                employeeId: null,
                driverId: 'DRV-101',
                vehicleId: 'VEH-101',
                serviceType: 'Local Cab',
                pickup: 'Koregaon Park, Pune',
                destination: 'Hinjawadi Phase 1, Pune',
                journeyDate: '2026-11-02',
                journeyTime: '09:30',
                returnDate: null,
                passengers: 2,
                vehicleType: 'Sedan',
                estimatedFare: 950,
                paymentStatus: 'Paid',
                bookingStatus: 'Confirmed',
                createdAt: '2026-10-29T10:00:00.000Z',
                customerName: 'Aarav Patel',
                customerPhone: '+91 98220 44444',
                customerEmail: 'customer@travelnex.com',
                notes: 'Please arrive 5 mins early at Gate 2.'
            },
            {
                id: 'TNX-BOOKING-1002',
                customerId: 'USR-CUS-1001',
                corporateId: null,
                employeeId: null,
                driverId: null,
                vehicleId: null,
                serviceType: 'Outstation',
                pickup: 'Pune City',
                destination: 'Lonavala Hill Station',
                journeyDate: '2026-11-05',
                journeyTime: '07:00',
                returnDate: '2026-11-06',
                passengers: 4,
                vehicleType: 'SUV',
                estimatedFare: 4200,
                paymentStatus: 'Pending',
                bookingStatus: 'Pending',
                createdAt: '2026-10-30T14:20:00.000Z',
                customerName: 'Aarav Patel',
                customerPhone: '+91 98220 44444',
                customerEmail: 'customer@travelnex.com',
                notes: 'Weekend leisure trip with luggage.'
            },
            {
                id: 'TNX-BOOKING-1003',
                customerId: 'USR-CORP-01',
                corporateId: 'CORP-101',
                employeeId: 'EMP-101',
                driverId: 'DRV-103',
                vehicleId: 'VEH-103',
                serviceType: 'Airport Transfer',
                pickup: 'TechCorp Campus, Hinjawadi',
                destination: 'Pune International Airport (PNQ)',
                journeyDate: '2026-10-28',
                journeyTime: '05:00',
                returnDate: null,
                passengers: 1,
                vehicleType: 'Sedan',
                estimatedFare: 1200,
                paymentStatus: 'Paid',
                bookingStatus: 'Completed',
                createdAt: '2026-10-27T09:15:00.000Z',
                customerName: 'Ananya Iyer (TechCorp)',
                customerPhone: '+91 98765 11001',
                customerEmail: 'ananya.i@techcorp.com',
                notes: 'Corporate client flight to Bengaluru.'
            },
            {
                id: 'TNX-BOOKING-1004',
                customerId: 'USR-CORP-01',
                corporateId: 'CORP-101',
                employeeId: 'EMP-102',
                driverId: 'DRV-102',
                vehicleId: 'VEH-102',
                serviceType: 'Outstation',
                pickup: 'TechCorp Pune, Magarpatta',
                destination: 'Bandra Kurla Complex (BKC), Mumbai',
                journeyDate: '2026-10-31',
                journeyTime: '06:30',
                returnDate: null,
                passengers: 2,
                vehicleType: 'SUV',
                estimatedFare: 3800,
                paymentStatus: 'Pending',
                bookingStatus: 'In Progress',
                createdAt: '2026-10-30T16:00:00.000Z',
                customerName: 'Vikram Malhotra (TechCorp)',
                customerPhone: '+91 98765 11002',
                customerEmail: 'vikram.m@techcorp.com',
                notes: 'Client quarterly pitch meeting.'
            }
        ];

        // 8. Invoices
        const seedInvoices = [
            {
                id: 'INV-2026-001',
                bookingId: 'TNX-BOOKING-1001',
                customerName: 'Aarav Patel',
                customerEmail: 'customer@travelnex.com',
                customerPhone: '+91 98220 44444',
                corporateId: null,
                serviceType: 'Local Cab',
                baseFare: 805,
                taxes: 145,
                totalAmount: 950,
                status: 'Paid',
                paymentMethod: 'UPI / Online',
                issuedDate: '2026-10-29',
                dueDate: '2026-10-29'
            },
            {
                id: 'INV-2026-002',
                bookingId: 'TNX-BOOKING-1003',
                customerName: 'Ananya Iyer',
                corporateId: 'CORP-101',
                companyName: 'TechCorp Global Solutions',
                customerEmail: 'ananya.i@techcorp.com',
                customerPhone: '+91 98765 11001',
                serviceType: 'Airport Transfer',
                baseFare: 1017,
                taxes: 183,
                totalAmount: 1200,
                status: 'Paid',
                paymentMethod: 'Corporate Monthly Account',
                issuedDate: '2026-10-28',
                dueDate: '2026-11-15'
            }
        ];

        // 9. Payments
        const seedPayments = [
            {
                id: 'PAY-8801',
                bookingId: 'TNX-BOOKING-1001',
                invoiceId: 'INV-2026-001',
                customerName: 'Aarav Patel',
                amount: 950,
                method: 'UPI / Online',
                status: 'Paid',
                transactionRef: 'UPI-TXN-90218311',
                date: '2026-10-29T10:05:00Z'
            },
            {
                id: 'PAY-8802',
                bookingId: 'TNX-BOOKING-1003',
                invoiceId: 'INV-2026-002',
                customerName: 'TechCorp (Ananya Iyer)',
                amount: 1200,
                method: 'Corporate Credit',
                status: 'Paid',
                transactionRef: 'CORP-INV-BILL-4421',
                date: '2026-10-28T09:30:00Z'
            }
        ];

        // 10. System Settings
        const seedSettings = {
            companyName: 'TRAVELNEX Mobility Solutions Pvt Ltd',
            brandTagline: 'Smart, Reliable & Premium Tours & Mobility',
            supportEmail: 'support@travelnex.com',
            supportPhone: '+91 1800 200 8989',
            officeAddress: 'TRAVELNEX Tower, Senapati Bapat Road, Pune, Maharashtra 411016',
            gstin: '27AAACT9999P1Z3',
            taxRatePercent: 18,
            currency: '₹',
            farePerKmSedan: 14,
            farePerKmSUV: 21,
            farePerKmLuxury: 42,
            farePerKmBus: 55,
            updatedAt: '2026-10-01T00:00:00Z'
        };

        // 11. Curated Tour Packages
        const seedPackages = [
            {
                id: 'PKG-BALI',
                title: 'Bali Tropical Luxury Island Retreat',
                destination: 'Bali, Indonesia',
                category: 'international',
                duration: '5 Days / 4 Nights',
                days: 5,
                nights: 4,
                price: 19999,
                oldPrice: 28500,
                discount: '30% OFF',
                hotel: '5-Star Private Pool Villa & Daily Breakfast',
                rating: 4.9,
                reviewsCount: 328,
                image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: true,
                highlights: ['Private infinity pool villa', 'Uluwatu sunset temple tour', 'Tegallalang rice terraces', 'Balinese spa wellness treatment', 'Speedboat transfer to Nusa Penida'],
                description: 'Escape to Indonesia’s tropical gem with private beachfront villas, lush emerald rice terraces, cliffside ocean temples and world-class hospitality.'
            },
            {
                id: 'PKG-SWISS',
                title: 'Swiss Alpine Panorama & Glacier Tour',
                destination: 'Interlaken & Zurich, Switzerland',
                category: 'international',
                duration: '6 Days / 5 Nights',
                days: 6,
                nights: 5,
                price: 31500,
                oldPrice: 42000,
                discount: '25% OFF',
                hotel: 'Luxury Alpine Chalet with Mountain View',
                rating: 4.9,
                reviewsCount: 412,
                image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: true,
                highlights: ['Jungfraujoch Top of Europe rail excursion', 'Lake Brienz scenic steamboat cruise', 'Lucerne Lion Monument & Chapel Bridge', 'First Cliff Walk Grindelwald', 'Swiss artisan chocolate tasting'],
                description: 'Experience majestic snow-capped peaks, crystal alpine lakes and scenic Swiss trains with our signature private tour package.'
            },
            {
                id: 'PKG-MALDIVES',
                title: 'Maldives Exclusive Overwater Haven',
                destination: 'Male Atoll, Maldives',
                category: 'international',
                duration: '4 Days / 3 Nights',
                days: 4,
                nights: 3,
                price: 35750,
                oldPrice: 55000,
                discount: '35% OFF',
                hotel: '5-Star Luxury Overwater Bungalow',
                rating: 5.0,
                reviewsCount: 520,
                image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: true,
                highlights: ['Glass-floor overwater bungalow', 'All-inclusive 3-course dining', 'Sunset dolphin catamaran cruise', 'Coral reef guided snorkeling', 'Candlelit ocean jetty dinner'],
                description: 'The ultimate romantic getaway featuring pristine turquoise lagoons, private sun decks, direct lagoon access and pure luxury.'
            },
            {
                id: 'PKG-DUBAI',
                title: 'Dubai Desert Safari & Marina Skyline',
                destination: 'Dubai, UAE',
                category: 'international',
                duration: '5 Days / 4 Nights',
                days: 5,
                nights: 4,
                price: 20800,
                oldPrice: 26000,
                discount: '20% OFF',
                hotel: 'Downtown 5-Star Hotel with Burj Views',
                rating: 4.8,
                reviewsCount: 290,
                image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: true,
                highlights: ['Burj Khalifa 124th floor VIP access', 'Red dune 4x4 desert safari & BBQ', 'Marina luxury yacht dinner cruise', 'Dubai Mall fountain show viewing', 'Miracle Garden & Gold Souk visit'],
                description: 'Where futuristic architecture meets Arabian desert luxury. Explore towering skyscrapers, thrilling desert adventures and mega-malls.'
            },
            {
                id: 'PKG-KASHMIR',
                title: 'Kashmir Paradise: Dal Lake & Gulmarg',
                destination: 'Srinagar & Gulmarg, Kashmir',
                category: 'domestic',
                duration: '6 Days / 5 Nights',
                days: 6,
                nights: 5,
                price: 15750,
                oldPrice: 21000,
                discount: '25% OFF',
                hotel: 'Deluxe Heritage Shikara Houseboat & Alpine Resort',
                rating: 4.9,
                reviewsCount: 380,
                image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: true,
                highlights: ['Dal Lake morning shikara ride', 'Gulmarg Gondola cable car ride', 'Pahalgam Betaab Valley excursion', 'Nishat & Shalimar Mughal Gardens', 'Authentic Kashmiri wazwan dinner'],
                description: 'Referred to as Heaven on Earth, enjoy serene houseboat stays on Dal Lake, snow sports in Gulmarg and pine valleys in Pahalgam.'
            },
            {
                id: 'PKG-SANTORINI',
                title: 'Santorini Caldera Sunset & Aegean Sea',
                destination: 'Santorini, Greece',
                category: 'international',
                duration: '4 Days / 3 Nights',
                days: 4,
                nights: 3,
                price: 26600,
                oldPrice: 38000,
                discount: '30% OFF',
                hotel: 'Whitewashed Cliffside Cave Suite',
                rating: 4.9,
                reviewsCount: 245,
                image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: true,
                highlights: ['Oia world-famous sunset terrace', 'Red & Black volcanic beach exploration', 'Aegean catamaran wine cruise', 'Ancient Akrotiri archaeological tour', 'Traditional Greek taverna feast'],
                description: 'Iconic whitewashed architecture, blue-domed churches and world-renowned Aegean sunsets overlooking the volcanic caldera.'
            },
            {
                id: 'PKG-TAJ',
                title: 'Royal Golden Triangle: Delhi, Agra & Jaipur',
                destination: 'Agra, Delhi & Jaipur, India',
                category: 'domestic',
                duration: '5 Days / 4 Nights',
                days: 5,
                nights: 4,
                price: 12499,
                oldPrice: 16500,
                discount: '24% OFF',
                hotel: 'Heritage 4-Star Haveli with Palace Courtyard',
                rating: 4.9,
                reviewsCount: 460,
                image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: false,
                highlights: ['Sunrise VIP guided tour of Taj Mahal', 'Agra Fort & Mehtab Bagh', 'Jaipur Amber Fort excursion', 'Hawa Mahal & City Palace museum', 'Dedicated chauffeur driven sedan'],
                description: 'India’s most celebrated cultural tour connecting historical Mughal Agra, royal Rajput Jaipur and monumental Delhi.'
            },
            {
                id: 'PKG-KERALA',
                title: 'Kerala Backwaters & Munnar Tea Mist',
                destination: 'Munnar & Alleppey, Kerala',
                category: 'domestic',
                duration: '5 Days / 4 Nights',
                days: 5,
                nights: 4,
                price: 14999,
                oldPrice: 19500,
                discount: '23% OFF',
                hotel: 'Private AC Houseboat & Hill Plantation Resort',
                rating: 4.9,
                reviewsCount: 510,
                image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: false,
                highlights: ['Alleppey luxury houseboat cruise', 'Munnar tea museum & Kolukkumalai', 'Periyar wildlife boat safari', 'Traditional Ayurvedic massage', 'Kathakali cultural performance'],
                description: 'Tranquil palm-fringed backwaters, spice-scented mountain mist, rolling tea estates and rich South Indian culinary heritage.'
            },
            {
                id: 'PKG-GOA',
                title: 'Goa Coastal Sun & Portuguese Heritage',
                destination: 'Goa, India',
                category: 'domestic',
                duration: '4 Days / 3 Nights',
                days: 4,
                nights: 3,
                price: 8999,
                oldPrice: 12000,
                discount: '25% OFF',
                hotel: 'Beachfront Resort with Pool & Breakfast',
                rating: 4.8,
                reviewsCount: 620,
                image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: false,
                highlights: ['Calangute, Baga & Anjuna beaches', 'Old Goa Basilica of Bom Jesus', 'Mandovi river sunset cruise', 'Water sports combo package', 'Dudhsagar waterfall trip'],
                description: 'Sun, sand, seafood and colonial Portuguese charm. The premier beach holiday for couples, friends and families.'
            },
            {
                id: 'PKG-FAMILY-PARIS',
                title: 'Parisian Splendor & Disneyland Family Tour',
                destination: 'Paris, France',
                category: 'family',
                duration: '6 Days / 5 Nights',
                days: 6,
                nights: 5,
                price: 34999,
                oldPrice: 45000,
                discount: '22% OFF',
                hotel: 'Family Suite near Disneyland & Metro',
                rating: 5.0,
                reviewsCount: 195,
                image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: false,
                highlights: ['Disneyland & Walt Disney Studios Passes', 'Eiffel Tower summit priority tickets', 'Seine river cruise with audio guides', 'Louvre Museum family discovery tour', 'Champs-Élysées walking tour'],
                description: 'A magical family vacation combining iconic Parisian monuments, world-class gastronomy and the wonders of Disneyland Paris.'
            },
            {
                id: 'PKG-FAMILY-SINGAPORE',
                title: 'Singapore Family Fun & Sentosa Island',
                destination: 'Singapore',
                category: 'family',
                duration: '5 Days / 4 Nights',
                days: 5,
                nights: 4,
                price: 29500,
                oldPrice: 38000,
                discount: '22% OFF',
                hotel: 'Orchard Road 4-Star Family Hotel',
                rating: 4.9,
                reviewsCount: 230,
                image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: false,
                highlights: ['Universal Studios Singapore VIP express pass', 'Gardens by the Bay Flower Dome', 'Night Safari guided tram ride', 'Sentosa Cable Car & S.E.A. Aquarium', 'Marina Bay Sands observation deck'],
                description: 'Clean, safe and packed with thrills for all ages. Enjoy futuristic gardens, marine wonderlands and Universal theme parks.'
            },
            {
                id: 'PKG-LAST-THAILAND',
                title: 'Flash Sale: Bangkok & Phuket Island Getaway',
                destination: 'Bangkok & Phuket, Thailand',
                category: 'last-minute',
                duration: '5 Days / 4 Nights',
                days: 5,
                nights: 4,
                price: 16999,
                oldPrice: 25000,
                discount: '32% OFF',
                hotel: 'Patong Beach Resort with Rooftop Pool',
                rating: 4.8,
                reviewsCount: 340,
                image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&auto=format&fit=crop&q=80',
                featured: true,
                hotDeal: true,
                highlights: ['Phi Phi Islands speedboat day trip with lunch', 'Wat Arun Temple of Dawn & Grand Palace', 'Phuket Big Buddha viewpoint', 'Chao Phraya Princess dinner cruise', 'Bangkok night market food tour'],
                description: 'Limited-time special discount on Thailand’s ultimate combination of vibrant city markets and turquoise island beaches.'
            }
        ];

        // 12. Curated Cruise Packages
        const seedCruises = [
            {
                id: 'CRZ-101',
                title: 'Cordelia Empress: Mumbai – Goa – Lakshadweep Voyage',
                shipName: 'Cordelia Empress',
                departurePort: 'Mumbai Port Trust',
                destination: 'Goa & Lakshadweep Islands',
                duration: '5 Days / 4 Nights',
                days: 5,
                nights: 4,
                price: 28999,
                originalPrice: 35000,
                rating: 4.8,
                reviewsCount: 312,
                image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800&auto=format&fit=crop&q=80',
                cabins: ['Interior Stateroom', 'Ocean View', 'Balcony Suite', 'Chairman Suite'],
                highlights: ['All Gourmet Meals Included', 'Broadway-Style Live Shows', 'Casino & Nightclub Access', 'Sunset Deck Pool Parties', 'Coral Reef Excursion in Lakshadweep'],
                departureDates: ['2026-11-15', '2026-11-29', '2026-12-12', '2026-12-24']
            },
            {
                id: 'CRZ-102',
                title: 'Royal Caribbean: Spectrum of the Seas – Singapore & Malaysia',
                shipName: 'Spectrum of the Seas',
                departurePort: 'Marina Bay Cruise Centre, Singapore',
                destination: 'Penang & Phuket',
                duration: '5 Days / 4 Nights',
                days: 5,
                nights: 4,
                price: 54500,
                originalPrice: 65000,
                rating: 4.9,
                reviewsCount: 428,
                image: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=800&auto=format&fit=crop&q=80',
                cabins: ['Interior Room', 'Ocean View Room', 'Spacious Balcony', 'Royal Suite Class'],
                highlights: ['RipCord by iFLY skydiving simulator', 'FlowRider surf simulator', 'Two70 panoramic entertainment venue', '14 world-class dining options', 'Duty-free luxury shopping gallery'],
                departureDates: ['2026-11-18', '2026-12-05', '2026-12-20', '2027-01-10']
            },
            {
                id: 'CRZ-103',
                title: 'Costa Toscana: Dubai, Abu Dhabi & Muscat Arabian Jewels',
                shipName: 'Costa Toscana',
                departurePort: 'Dubai Harbour Cruise Terminal',
                destination: 'Abu Dhabi, Sir Bani Yas Island & Muscat',
                duration: '7 Days / 6 Nights',
                days: 7,
                nights: 6,
                price: 68200,
                originalPrice: 79900,
                rating: 4.8,
                reviewsCount: 289,
                image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&auto=format&fit=crop&q=80',
                cabins: ['Classic Inside', 'Premium Oceanview', 'Balcony on the Sea', 'Grand Suite'],
                highlights: ['Heated sea salt water splash parks', 'Italian fine dining & Michelin-inspired gastronomy', 'Formula 1 racing simulator', 'Desert safari shore excursions in Oman', 'Sootheian wellness spa retreat'],
                departureDates: ['2026-11-22', '2026-12-08', '2026-12-25', '2027-01-14']
            },
            {
                id: 'CRZ-104',
                title: 'Grand Western Mediterranean Splendour – Barcelona & Rome',
                shipName: 'Norwegian Epic',
                departurePort: 'Port of Barcelona, Spain',
                destination: 'Marseille, Florence, Rome & Naples',
                duration: '8 Days / 7 Nights',
                days: 8,
                nights: 7,
                price: 112000,
                originalPrice: 130000,
                rating: 4.9,
                reviewsCount: 512,
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
                cabins: ['Studio for Solo Travelers', 'Balcony Stateroom', 'Club Balcony Suite', 'The Haven Luxury Complex'],
                highlights: ['Overnight in Livorno for Florence & Pisa', 'Colosseum & Vatican VIP guided shore tours', 'Aqua Park with 3 multi-story water slides', 'Open-bar beverage packages available', 'Award-winning Broadway production Priscilla'],
                departureDates: ['2026-11-25', '2026-12-15', '2027-01-05', '2027-02-12']
            },
            {
                id: 'CRZ-105',
                title: 'Celebrity Cruises: Greek Isles & Santorini Sunset Voyage',
                shipName: 'Celebrity Infinity',
                departurePort: 'Piraeus (Athens), Greece',
                destination: 'Mykonos, Santorini, Rhodes & Ephesus',
                duration: '7 Days / 6 Nights',
                days: 7,
                nights: 6,
                price: 96400,
                originalPrice: 115000,
                rating: 4.9,
                reviewsCount: 367,
                image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80',
                cabins: ['Ocean View', 'Veranda Stateroom', 'Concierge Class', 'AquaClass with Spa Privileges'],
                highlights: ['World-famous Oia sunset view from private deck', 'Ancient Ruins of Ephesus archaeological tour', 'Michelin-starred rooftop terrace dining', 'Complimentary wine tasting sessions', 'Infinite Veranda modern ocean views'],
                departureDates: ['2026-11-20', '2026-12-10', '2026-12-30', '2027-01-20']
            },
            {
                id: 'CRZ-106',
                title: 'Kerala Heritage Luxury Houseboat: Alleppey & Kumarakom',
                shipName: 'Spice Coast Heritage Houseboat',
                departurePort: 'Finishing Point Jetty, Alleppey',
                destination: 'Alleppey Backwaters & Vembanad Lake',
                duration: '3 Days / 2 Nights',
                days: 3,
                nights: 2,
                price: 18500,
                originalPrice: 22000,
                rating: 4.8,
                reviewsCount: 198,
                image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&auto=format&fit=crop&q=80',
                cabins: ['Deluxe AC Bedroom', 'Premium Upper Deck Suite', 'Royal Honeymoon Suite'],
                highlights: ['Traditional Kerala Karimeen Pollichathu feast', 'Private personal chef on board', 'Quiet canal village canoe ride', 'Ayurvedic wellness rejuvenation kit', 'Stargazing on open sundeck'],
                departureDates: ['Daily Departures Available']
            }
        ];

        // 13. Curated Flights
        const seedFlights = [
            {
                id: 'FLT-101',
                airline: 'IndiGo',
                airlineCode: '6E',
                flightNumber: '6E-2045',
                logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80',
                from: 'Mumbai',
                fromCode: 'BOM',
                fromAirport: 'Chhatrapati Shivaji Maharaj International Airport (T2)',
                to: 'New Delhi',
                toCode: 'DEL',
                toAirport: 'Indira Gandhi International Airport (T3)',
                depTime: '06:15',
                arrTime: '08:30',
                duration: '2h 15m',
                stops: 'Non-stop',
                economyPrice: 4850,
                businessPrice: 14200,
                refundable: true,
                seatsLeft: 12,
                baggage: '15 kg Check-in + 7 kg Cabin'
            },
            {
                id: 'FLT-102',
                airline: 'Air India',
                airlineCode: 'AI',
                flightNumber: 'AI-887',
                logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80',
                from: 'Mumbai',
                fromCode: 'BOM',
                fromAirport: 'Chhatrapati Shivaji Maharaj International Airport (T2)',
                to: 'Goa',
                toCode: 'GOI',
                toAirport: 'Manohar International Airport, Mopa (GOX)',
                depTime: '09:40',
                arrTime: '11:00',
                duration: '1h 20m',
                stops: 'Non-stop',
                economyPrice: 3499,
                businessPrice: 11500,
                refundable: true,
                seatsLeft: 8,
                baggage: '20 kg Check-in + 7 kg Cabin'
            },
            {
                id: 'FLT-103',
                airline: 'Vistara',
                airlineCode: 'UK',
                flightNumber: 'UK-992',
                logo: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=100&auto=format&fit=crop&q=80',
                from: 'New Delhi',
                fromCode: 'DEL',
                fromAirport: 'Indira Gandhi International Airport (T3)',
                to: 'Bengaluru',
                toCode: 'BLR',
                toAirport: 'Kempegowda International Airport (T2)',
                depTime: '11:15',
                arrTime: '14:05',
                duration: '2h 50m',
                stops: 'Non-stop',
                economyPrice: 5920,
                businessPrice: 18400,
                refundable: true,
                seatsLeft: 15,
                baggage: '15 kg Check-in + 7 kg Cabin'
            },
            {
                id: 'FLT-104',
                airline: 'Emirates',
                airlineCode: 'EK',
                flightNumber: 'EK-501',
                logo: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=100&auto=format&fit=crop&q=80',
                from: 'Mumbai',
                fromCode: 'BOM',
                fromAirport: 'Chhatrapati Shivaji Maharaj International Airport (T2)',
                to: 'Dubai',
                toCode: 'DXB',
                toAirport: 'Dubai International Airport (T3)',
                depTime: '04:30',
                arrTime: '06:15',
                duration: '3h 15m',
                stops: 'Non-stop',
                economyPrice: 16800,
                businessPrice: 52000,
                refundable: true,
                seatsLeft: 6,
                baggage: '30 kg Check-in + 7 kg Cabin'
            },
            {
                id: 'FLT-105',
                airline: 'Singapore Airlines',
                airlineCode: 'SQ',
                flightNumber: 'SQ-421',
                logo: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=100&auto=format&fit=crop&q=80',
                from: 'Mumbai',
                fromCode: 'BOM',
                fromAirport: 'Chhatrapati Shivaji Maharaj International Airport (T2)',
                to: 'Singapore',
                toCode: 'SIN',
                toAirport: 'Singapore Changi Airport (T3)',
                depTime: '11:45',
                arrTime: '19:50',
                duration: '5h 35m',
                stops: 'Non-stop',
                economyPrice: 24200,
                businessPrice: 74500,
                refundable: true,
                seatsLeft: 9,
                baggage: '25 kg Check-in + 7 kg Cabin'
            },
            {
                id: 'FLT-106',
                airline: 'IndiGo',
                airlineCode: '6E',
                flightNumber: '6E-1402',
                logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&auto=format&fit=crop&q=80',
                from: 'Bengaluru',
                fromCode: 'BLR',
                fromAirport: 'Kempegowda International Airport (T2)',
                to: 'Maldives (Male)',
                toCode: 'MLE',
                toAirport: 'Velana International Airport (MLE)',
                depTime: '08:20',
                arrTime: '10:15',
                duration: '1h 55m',
                stops: 'Non-stop',
                economyPrice: 11999,
                businessPrice: 29000,
                refundable: true,
                seatsLeft: 11,
                baggage: '20 kg Check-in + 7 kg Cabin'
            },
            {
                id: 'FLT-107',
                airline: 'Air India',
                airlineCode: 'AI',
                flightNumber: 'AI-161',
                logo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100&auto=format&fit=crop&q=80',
                from: 'New Delhi',
                fromCode: 'DEL',
                fromAirport: 'Indira Gandhi International Airport (T3)',
                to: 'London',
                toCode: 'LHR',
                toAirport: 'London Heathrow Airport (T2)',
                depTime: '02:45',
                arrTime: '07:30',
                duration: '9h 15m',
                stops: 'Non-stop',
                economyPrice: 42500,
                businessPrice: 135000,
                refundable: true,
                seatsLeft: 5,
                baggage: '2x 23 kg Check-in + 8 kg Cabin'
            },
            {
                id: 'FLT-108',
                airline: 'Akasa Air',
                airlineCode: 'QP',
                flightNumber: 'QP-1384',
                logo: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=100&auto=format&fit=crop&q=80',
                from: 'Mumbai',
                fromCode: 'BOM',
                fromAirport: 'Chhatrapati Shivaji Maharaj International Airport (T1)',
                to: 'Varanasi',
                toCode: 'VNS',
                toAirport: 'Lal Bahadur Shastri Airport',
                depTime: '07:10',
                arrTime: '09:25',
                duration: '2h 15m',
                stops: 'Non-stop',
                economyPrice: 3999,
                businessPrice: 12800,
                refundable: true,
                seatsLeft: 14,
                baggage: '15 kg Check-in + 7 kg Cabin'
            }
        ];

        // Write all to LocalStorage
        this.set(STORAGE_KEYS.USERS, seedUsers);
        this.set(STORAGE_KEYS.CORPORATE_CLIENTS, seedCorporateClients);
        this.set(STORAGE_KEYS.EMPLOYEES, seedEmployees);
        this.set(STORAGE_KEYS.VEHICLES, seedVehicles);
        this.set(STORAGE_KEYS.DRIVERS, seedDrivers);
        this.set(STORAGE_KEYS.SERVICES, seedServices);
        this.set(STORAGE_KEYS.BOOKINGS, seedBookings);
        this.set(STORAGE_KEYS.INVOICES, seedInvoices);
        this.set(STORAGE_KEYS.PAYMENTS, seedPayments);
        this.set(STORAGE_KEYS.SETTINGS, seedSettings);
        this.set(STORAGE_KEYS.PACKAGES, seedPackages);
        this.set(STORAGE_KEYS.CRUISES, seedCruises);
        this.set(STORAGE_KEYS.FLIGHTS, seedFlights);
        this.set(STORAGE_KEYS.INITIALIZED, true);

        console.log('TRAVELNEX demo data initialized successfully.');
    },

    // Reset Demo Data with fresh seed records
    resetDemoData() {
        localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
        this.initSeedData(true);
    },

    // =========================================================================
    // BOOKINGS API
    // =========================================================================
    getBookings() {
        const raw = this.get(STORAGE_KEYS.BOOKINGS, []);
        return raw.map(b => ({
            ...b,
            pickup: b.pickup || b.pickupLocation || 'Pickup Point',
            destination: b.destination || b.dropLocation || 'Destination Point',
            estimatedFare: Number(b.estimatedFare || b.amount) || 0,
            bookingStatus: b.bookingStatus || b.status || 'Pending',
            customerName: b.customerName || b.passengerName || 'Valued Traveler',
            customerPhone: b.customerPhone || b.passengerPhone || '+91 98765 00000',
            customerEmail: b.customerEmail || b.passengerEmail || '',
            journeyDate: b.journeyDate || (b.pickupDateTime ? b.pickupDateTime.split('T')[0] : (b.createdAt ? b.createdAt.split('T')[0] : new Date().toISOString().split('T')[0])),
            journeyTime: b.journeyTime || (b.pickupDateTime && b.pickupDateTime.includes('T') ? b.pickupDateTime.split('T')[1] : '10:00')
        }));
    },

    getBookingById(id) {
        const bookings = this.getBookings();
        return bookings.find(b => b.id === id) || null;
    },

    createBooking(bookingData) {
        const bookings = this.getBookings();
        const datePart = bookingData.journeyDate || (bookingData.pickupDateTime ? bookingData.pickupDateTime.split('T')[0] : new Date().toISOString().split('T')[0]);
        const timePart = bookingData.journeyTime || (bookingData.pickupDateTime && bookingData.pickupDateTime.includes('T') ? bookingData.pickupDateTime.split('T')[1] : '10:00');

        const newBooking = {
            id: bookingData.id || this.generateId('TNX-BOOKING'),
            customerId: bookingData.customerId || null,
            corporateId: bookingData.corporateId || null,
            employeeId: bookingData.employeeId || null,
            driverId: bookingData.driverId || null,
            vehicleId: bookingData.vehicleId || null,
            serviceType: bookingData.serviceType || 'Local Cab',
            pickup: bookingData.pickup || bookingData.pickupLocation || 'Pickup Address',
            destination: bookingData.destination || bookingData.dropLocation || 'Drop Address',
            journeyDate: datePart,
            journeyTime: timePart,
            returnDate: bookingData.returnDate || null,
            passengers: Number(bookingData.passengers) || 1,
            vehicleType: bookingData.vehicleType || 'Sedan',
            estimatedFare: Number(bookingData.estimatedFare || bookingData.amount) || 0,
            paymentStatus: bookingData.paymentStatus || 'Pending',
            bookingStatus: bookingData.bookingStatus || bookingData.status || 'Pending',
            createdAt: new Date().toISOString(),
            customerName: bookingData.customerName || bookingData.passengerName || 'Valued Traveler',
            customerPhone: bookingData.customerPhone || bookingData.passengerPhone || '',
            customerEmail: bookingData.customerEmail || bookingData.passengerEmail || '',
            notes: bookingData.notes || ''
        };

        bookings.unshift(newBooking);
        this.set(STORAGE_KEYS.BOOKINGS, bookings);
        return newBooking;
    },

    updateBookingStatus(id, newStatus, extraData = {}) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id === id);
        if (index === -1) return false;

        bookings[index].bookingStatus = newStatus;
        Object.assign(bookings[index], extraData);

        // If trip is completed and no invoice exists, auto generate one
        if (newStatus === 'Completed') {
            this.generateInvoiceForBooking(id);
        }

        // If trip started, mark driver as On Trip
        if (newStatus === 'In Progress' && bookings[index].driverId) {
            this.updateDriverAvailability(bookings[index].driverId, 'On Trip');
        } else if (newStatus === 'Completed' && bookings[index].driverId) {
            this.updateDriverAvailability(bookings[index].driverId, 'Available');
        }

        this.set(STORAGE_KEYS.BOOKINGS, bookings);
        return bookings[index];
    },

    assignDriverAndVehicle(bookingId, driverId, vehicleId) {
        const bookings = this.getBookings();
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index === -1) return false;

        bookings[index].driverId = driverId;
        bookings[index].vehicleId = vehicleId;
        bookings[index].bookingStatus = 'Confirmed';

        // Update driver's assigned vehicle if specified
        if (driverId && vehicleId) {
            const drivers = this.getDrivers();
            const dIdx = drivers.findIndex(d => d.id === driverId);
            if (dIdx !== -1) {
                drivers[dIdx].assignedVehicleId = vehicleId;
                this.set(STORAGE_KEYS.DRIVERS, drivers);
            }
        }

        this.set(STORAGE_KEYS.BOOKINGS, bookings);
        return bookings[index];
    },

    cancelBooking(id, reason = 'Cancelled by user') {
        return this.updateBookingStatus(id, 'Cancelled', {
            cancelReason: reason,
            cancelledAt: new Date().toISOString()
        });
    },

    // =========================================================================
    // DRIVERS API
    // =========================================================================
    getDrivers() {
        return this.get(STORAGE_KEYS.DRIVERS, []);
    },

    getDriverById(id) {
        return this.getDrivers().find(d => d.id === id) || null;
    },

    saveDriver(driverData) {
        const drivers = this.getDrivers();
        if (driverData.id) {
            const index = drivers.findIndex(d => d.id === driverData.id);
            if (index !== -1) {
                drivers[index] = { ...drivers[index], ...driverData };
                this.set(STORAGE_KEYS.DRIVERS, drivers);
                return drivers[index];
            }
        }
        const newDriver = {
            id: this.generateId('DRV'),
            rating: 5.0,
            totalTrips: 0,
            availabilityStatus: 'Available',
            status: 'Active',
            ...driverData
        };
        drivers.push(newDriver);
        this.set(STORAGE_KEYS.DRIVERS, drivers);
        return newDriver;
    },

    deleteDriver(id) {
        const drivers = this.getDrivers().filter(d => d.id !== id);
        this.set(STORAGE_KEYS.DRIVERS, drivers);
        return true;
    },

    updateDriverAvailability(driverId, status) {
        const drivers = this.getDrivers();
        const index = drivers.findIndex(d => d.id === driverId);
        if (index !== -1) {
            drivers[index].availabilityStatus = status;
            this.set(STORAGE_KEYS.DRIVERS, drivers);
            return true;
        }
        return false;
    },

    // =========================================================================
    // VEHICLES API
    // =========================================================================
    getVehicles() {
        return this.get(STORAGE_KEYS.VEHICLES, []);
    },

    getVehicleById(id) {
        return this.getVehicles().find(v => v.id === id) || null;
    },

    saveVehicle(vehicleData) {
        const vehicles = this.getVehicles();
        if (vehicleData.id) {
            const index = vehicles.findIndex(v => v.id === vehicleData.id);
            if (index !== -1) {
                vehicles[index] = { ...vehicles[index], ...vehicleData };
                this.set(STORAGE_KEYS.VEHICLES, vehicles);
                return vehicles[index];
            }
        }
        const newVehicle = {
            id: this.generateId('VEH'),
            status: 'Available',
            ...vehicleData
        };
        vehicles.push(newVehicle);
        this.set(STORAGE_KEYS.VEHICLES, vehicles);
        return newVehicle;
    },

    deleteVehicle(id) {
        const vehicles = this.getVehicles().filter(v => v.id !== id);
        this.set(STORAGE_KEYS.VEHICLES, vehicles);
        return true;
    },

    // =========================================================================
    // CORPORATE & EMPLOYEES API
    // =========================================================================
    getCorporateClients() {
        return this.get(STORAGE_KEYS.CORPORATE_CLIENTS, []);
    },

    getCorporateClientById(id) {
        return this.getCorporateClients().find(c => c.id === id) || null;
    },

    saveCorporateClient(clientData) {
        const clients = this.getCorporateClients();
        if (clientData.id) {
            const index = clients.findIndex(c => c.id === clientData.id);
            if (index !== -1) {
                clients[index] = { ...clients[index], ...clientData };
                this.set(STORAGE_KEYS.CORPORATE_CLIENTS, clients);
                return clients[index];
            }
        }
        const newClient = {
            id: this.generateId('CORP'),
            registeredAt: new Date().toISOString(),
            status: 'Approved',
            creditLimit: 200000,
            ...clientData
        };
        clients.push(newClient);
        this.set(STORAGE_KEYS.CORPORATE_CLIENTS, clients);
        return newClient;
    },

    updateCorporateStatus(id, newStatus) {
        const clients = this.getCorporateClients();
        const index = clients.findIndex(c => c.id === id);
        if (index !== -1) {
            clients[index].status = newStatus;
            this.set(STORAGE_KEYS.CORPORATE_CLIENTS, clients);
            return true;
        }
        return false;
    },

    getEmployees(corporateId = null) {
        const all = this.get(STORAGE_KEYS.EMPLOYEES, []);
        if (!corporateId) return all;
        return all.filter(e => e.corporateId === corporateId);
    },

    getEmployeeById(id) {
        return this.get(STORAGE_KEYS.EMPLOYEES, []).find(e => e.id === id) || null;
    },

    saveEmployee(employeeData) {
        const employees = this.get(STORAGE_KEYS.EMPLOYEES, []);
        if (employeeData.id) {
            const index = employees.findIndex(e => e.id === employeeData.id);
            if (index !== -1) {
                employees[index] = { ...employees[index], ...employeeData };
                this.set(STORAGE_KEYS.EMPLOYEES, employees);
                return employees[index];
            }
        }
        const newEmp = {
            id: this.generateId('EMP'),
            status: 'Active',
            createdAt: new Date().toISOString(),
            ...employeeData
        };
        employees.push(newEmp);
        this.set(STORAGE_KEYS.EMPLOYEES, employees);
        return newEmp;
    },

    deleteEmployee(id) {
        const employees = this.get(STORAGE_KEYS.EMPLOYEES, []).filter(e => e.id !== id);
        this.set(STORAGE_KEYS.EMPLOYEES, employees);
        return true;
    },

    // =========================================================================
    // INVOICES & PAYMENTS API
    // =========================================================================
    getInvoices() {
        return this.get(STORAGE_KEYS.INVOICES, []);
    },

    getInvoiceById(id) {
        return this.getInvoices().find(inv => inv.id === id) || null;
    },

    getInvoiceByBookingId(bookingId) {
        return this.getInvoices().find(inv => inv.bookingId === bookingId) || null;
    },

    generateInvoiceForBooking(bookingId) {
        const existing = this.getInvoiceByBookingId(bookingId);
        if (existing) return existing;

        const booking = this.getBookingById(bookingId);
        if (!booking) return null;

        const total = booking.estimatedFare || 1000;
        const baseFare = Math.round(total / 1.18);
        const taxes = total - baseFare;

        const invoice = {
            id: this.generateId('INV-2026'),
            bookingId: booking.id,
            customerName: booking.customerName,
            customerEmail: booking.customerEmail,
            customerPhone: booking.customerPhone,
            corporateId: booking.corporateId,
            serviceType: booking.serviceType,
            baseFare: baseFare,
            taxes: taxes,
            totalAmount: total,
            status: booking.paymentStatus === 'Paid' ? 'Paid' : 'Pending',
            paymentMethod: booking.corporateId ? 'Corporate Billing' : 'UPI / Card',
            issuedDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
        };

        const invoices = this.getInvoices();
        invoices.unshift(invoice);
        this.set(STORAGE_KEYS.INVOICES, invoices);

        // Also add a payment record if paid
        if (invoice.status === 'Paid') {
            this.addPayment({
                bookingId: booking.id,
                invoiceId: invoice.id,
                customerName: booking.customerName,
                amount: total,
                method: invoice.paymentMethod,
                status: 'Paid'
            });
        }

        return invoice;
    },

    getPayments() {
        return this.get(STORAGE_KEYS.PAYMENTS, []);
    },

    addPayment(paymentData) {
        const payments = this.getPayments();
        const newPayment = {
            id: this.generateId('PAY'),
            status: 'Paid',
            date: new Date().toISOString(),
            transactionRef: 'TXN-' + Math.floor(10000000 + Math.random() * 90000000),
            ...paymentData
        };
        payments.unshift(newPayment);
        this.set(STORAGE_KEYS.PAYMENTS, payments);

        // Sync booking payment status
        if (paymentData.bookingId) {
            const bookings = this.getBookings();
            const bIdx = bookings.findIndex(b => b.id === paymentData.bookingId);
            if (bIdx !== -1) {
                bookings[bIdx].paymentStatus = paymentData.status || 'Paid';
                this.set(STORAGE_KEYS.BOOKINGS, bookings);
            }
        }
        return newPayment;
    },

    updatePaymentStatus(id, newStatus) {
        const payments = this.getPayments();
        const index = payments.findIndex(p => p.id === id);
        if (index !== -1) {
            payments[index].status = newStatus;
            this.set(STORAGE_KEYS.PAYMENTS, payments);
            return true;
        }
        return false;
    },

    // =========================================================================
    // SERVICES & SETTINGS API
    // =========================================================================
    getServices() {
        return this.get(STORAGE_KEYS.SERVICES, []);
    },

    saveService(serviceData) {
        const services = this.getServices();
        const index = services.findIndex(s => s.id === serviceData.id);
        if (index !== -1) {
            services[index] = { ...services[index], ...serviceData };
        } else {
            services.push({ id: this.generateId('SRV'), ...serviceData });
        }
        this.set(STORAGE_KEYS.SERVICES, services);
        return true;
    },

    getSettings() {
        return this.get(STORAGE_KEYS.SETTINGS, {});
    },

    saveSettings(settingsData) {
        const current = this.getSettings();
        const updated = { ...current, ...settingsData, updatedAt: new Date().toISOString() };
        this.set(STORAGE_KEYS.SETTINGS, updated);
        return updated;
    },

    // =========================================================================
    // PACKAGES & TOURS API
    // =========================================================================
    getPackages() {
        const pkgs = this.get(STORAGE_KEYS.PACKAGES, []);
        if (!pkgs || pkgs.length === 0) {
            this.initSeedData(true);
            return this.get(STORAGE_KEYS.PACKAGES, []);
        }
        return pkgs;
    },

    getPackageById(id) {
        const list = this.getPackages();
        return list.find(p => p.id === id) || null;
    },

    getPackagesByCategory(category) {
        const list = this.getPackages();
        if (!category || category === 'all') return list;
        return list.filter(p => p.category === category.toLowerCase());
    },

    savePackage(pkgData) {
        const list = this.getPackages();
        const idx = list.findIndex(p => p.id === pkgData.id);
        if (idx !== -1) {
            list[idx] = { ...list[idx], ...pkgData };
        } else {
            list.push({ id: this.generateId('PKG'), ...pkgData });
        }
        this.set(STORAGE_KEYS.PACKAGES, list);
        return true;
    },

    // Enquiries / Leads
    getEnquiries() {
        return this.get(STORAGE_KEYS.ENQUIRIES, []);
    },

    createEnquiry(enquiryData) {
        const list = this.getEnquiries();
        const newEnq = {
            id: this.generateId('ENQ'),
            ...enquiryData,
            createdAt: new Date().toISOString()
        };
        list.unshift(newEnq);
        this.set(STORAGE_KEYS.ENQUIRIES, list);
        return newEnq;
    },

    // =========================================================================
    // CRUISES API
    // =========================================================================
    getCruises() {
        const list = this.get(STORAGE_KEYS.CRUISES, []);
        if (!list || list.length === 0) {
            this.initSeedData(true);
            return this.get(STORAGE_KEYS.CRUISES, []);
        }
        return list;
    },

    getCruiseById(id) {
        const list = this.getCruises();
        return list.find(c => c.id === id) || null;
    },

    // =========================================================================
    // FLIGHTS API
    // =========================================================================
    getFlights() {
        const list = this.get(STORAGE_KEYS.FLIGHTS, []);
        if (!list || list.length === 0) {
            this.initSeedData(true);
            return this.get(STORAGE_KEYS.FLIGHTS, []);
        }
        return list;
    },

    getFlightById(id) {
        const list = this.getFlights();
        return list.find(f => f.id === id) || null;
    },

    searchFlights(fromCity, toCity, flightType = 'one-way') {
        const flights = this.getFlights();
        if (!fromCity && !toCity) return flights;
        return flights.filter(f => {
            const matchFrom = !fromCity || 
                f.from.toLowerCase().includes(fromCity.toLowerCase()) || 
                f.fromCode.toLowerCase().includes(fromCity.toLowerCase());
            const matchTo = !toCity || 
                f.to.toLowerCase().includes(toCity.toLowerCase()) || 
                f.toCode.toLowerCase().includes(toCity.toLowerCase());
            return matchFrom && matchTo;
        });
    },

    // =========================================================================
    // EXPORT CSV HELPER
    // =========================================================================
    exportToCSV(filename, headers, rows) {
        const escapeCell = cell => {
            const str = String(cell ?? '');
            return `"${str.replace(/"/g, '""')}"`;
        };

        const csvContent = [
            headers.map(escapeCell).join(','),
            ...rows.map(row => row.map(escapeCell).join(','))
        ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// Initialize seed data on file load
StorageManager.initSeedData();
