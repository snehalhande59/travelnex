/**
 * TRAVELNEX Unified Navbar Controller & Reusable Component
 * Handles active link detection, mobile drawer toggles, and live auth state.
 */

(function () {
    'use strict';

    function initNavbar() {
        const path = window.location.pathname.toLowerCase();

        // 1. Highlight the current active page
        const navLinks = document.querySelectorAll('.nav-links a, .site-nav-links a, .drawer-menu a, .mobile-nav-links a');
        navLinks.forEach(link => {
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (!href || href.startsWith('javascript:')) return;

            const isCurrent = path.endsWith('/' + href) || (href === 'index.html' && (path.endsWith('/') || path.endsWith('/customer/') || path.endsWith('/customer')));
            if (isCurrent) {
                link.classList.add('active');
            }
        });

        // 1b. If on an individual service page, highlight Services parent toggle
        const servicesLinks = document.querySelectorAll('.nav-dropdown-panel a, #mobileSubMenu a, #mobileIndexSub a');
        let isServiceActive = false;
        servicesLinks.forEach(sLink => {
            const sHref = (sLink.getAttribute('href') || '').toLowerCase();
            if (sHref && path.endsWith('/' + sHref)) {
                isServiceActive = true;
                sLink.style.fontWeight = '700';
                sLink.style.color = '#e5a00d';
            }
        });
        if (isServiceActive) {
            const sToggle = document.querySelector('.services-toggle');
            if (sToggle) sToggle.classList.add('active');
        }

        // 1c. If on any portal/dashboard page, highlight Dashboards parent toggle
        const portalLinks = document.querySelectorAll('.dropdown-portals a, #mobilePortalsSub a');
        let isPortalActive = false;
        portalLinks.forEach(pLink => {
            const pHref = (pLink.getAttribute('href') || '').toLowerCase();
            if (pHref && path.endsWith('/' + pHref.replace('../', ''))) {
                isPortalActive = true;
                pLink.style.fontWeight = '700';
            }
        });
        if (isPortalActive) {
            const pToggle = document.querySelector('.portals-toggle');
            if (pToggle) pToggle.classList.add('active');
        }

        // 2. Auth State Sync
        if (typeof Auth !== 'undefined' && Auth.getCurrentUser) {
            const user = Auth.getCurrentUser();
            if (user && user.name) {
                const firstName = user.name.split(' ')[0];
                let dashHref = 'customer-dashboard.html';
                if (user.role === 'admin') dashHref = '../admin/admin-dashboard.html';
                else if (user.role === 'corporate') dashHref = '../corporate/corporate-dashboard.html';
                else if (user.role === 'driver') dashHref = '../driver/driver-dashboard.html';

                const authBtns = document.querySelectorAll('#navbarAuthBtn, .nav-auth-pill');
                authBtns.forEach(btn => {
                    if (btn.id === 'navbarAuthBtn' || btn.classList.contains('nav-auth-pill')) {
                        btn.innerHTML = `<i class="fa-solid fa-circle-user"></i> <span>${(typeof Utils !== 'undefined' && Utils.escapeHTML) ? Utils.escapeHTML(firstName) : firstName}</span>`;
                        btn.href = dashHref;
                        btn.title = `Logged in as ${user.name} (${user.role.toUpperCase()}) - Open Dashboard`;
                    }
                });

                const drawerAuth = document.getElementById('drawerAuthLink');
                if (drawerAuth) {
                    drawerAuth.innerHTML = `<i class="fa-solid fa-circle-user"></i> My Dashboard (${firstName})`;
                    drawerAuth.href = dashHref;
                }
            }
        }
    }

    // Mobile Drawer Handlers (Universal)
    window.toggleDrawer = function () {
        const drawer = document.getElementById('mobileDrawer') || document.querySelector('.mobile-nav-drawer, .mobile-drawer');
        const backdrop = document.getElementById('drawerBackdrop') || document.getElementById('drawerOverlay') || document.querySelector('.mobile-nav-backdrop, .mobile-drawer-overlay');
        if (drawer) {
            drawer.classList.toggle('open');
            drawer.classList.toggle('active');
        }
        if (backdrop) {
            backdrop.classList.toggle('show');
            backdrop.classList.toggle('active');
        }
        document.body.classList.toggle('drawer-open');
    };

    window.toggleMobileSubMenu = function () {
        const subMenu = document.getElementById('mobileSubMenu') || document.getElementById('mobileIndexSub') || document.querySelector('.mobile-sub-menu');
        const caret = document.getElementById('mobileSubCaret');
        if (subMenu) {
            subMenu.classList.toggle('show');
            subMenu.classList.toggle('active');
            if (caret) caret.style.transform = (subMenu.classList.contains('show') || subMenu.classList.contains('active')) ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    };

    window.toggleMobilePortalsSub = function () {
        const subMenu = document.getElementById('mobilePortalsSub');
        const caret = document.getElementById('mobilePortalsCaret');
        if (subMenu) {
            subMenu.classList.toggle('show');
            subMenu.classList.toggle('active');
            if (caret) caret.style.transform = (subMenu.classList.contains('show') || subMenu.classList.contains('active')) ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    };

    window.toggleMobileIndexServices = window.toggleMobileSubMenu;

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const drawer = document.getElementById('mobileDrawer') || document.querySelector('.mobile-nav-drawer, .mobile-drawer');
            if (drawer && (drawer.classList.contains('open') || drawer.classList.contains('active'))) {
                window.toggleDrawer();
            }
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavbar);
    } else {
        initNavbar();
    }
})();
