/**
 * TRAVELNEX Unified Navbar Controller & Reusable Component
 * Handles active link detection, mobile drawer toggles, and live auth state.
 */

(function () {
    'use strict';

    function initNavbar() {
        const path = window.location.pathname.toLowerCase();

        // 1. Highlight the current active page
        const navLinks = document.querySelectorAll('.nav-links a, .site-nav-links a, .drawer-menu a');
        navLinks.forEach(link => {
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (!href || href.startsWith('javascript:')) return;

            const isCurrent = path.endsWith('/' + href) || (href === 'index.html' && (path.endsWith('/') || path.endsWith('/customer/')));
            if (isCurrent) {
                link.classList.add('active');
            }
        });

        // 1b. If on an individual service page, highlight Services parent toggle
        const servicesLinks = document.querySelectorAll('.nav-dropdown-panel a, #mobileSubMenu a');
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
            const sToggle = document.querySelector('.nav-dropdown-toggle');
            if (sToggle) sToggle.classList.add('active');
        }

        // 2. Auth State Sync
        if (typeof Auth !== 'undefined' && Auth.getCurrentUser) {
            const user = Auth.getCurrentUser();
            if (user && user.name) {
                const firstName = user.name.split(' ')[0];
                const authBtns = document.querySelectorAll('#navbarAuthBtn, .nav-auth-pill');
                authBtns.forEach(btn => {
                    if (btn.id === 'navbarAuthBtn' || btn.classList.contains('nav-auth-pill')) {
                        btn.innerHTML = `<i class="fa-solid fa-circle-user"></i> <span>${Utils.escapeHTML(firstName)}</span>`;
                        btn.href = 'customer-dashboard.html';
                    }
                });

                const drawerAuth = document.getElementById('drawerAuthLink');
                if (drawerAuth) {
                    drawerAuth.innerHTML = `<i class="fa-solid fa-circle-user"></i> My Dashboard (${Utils.escapeHTML(firstName)})`;
                    drawerAuth.href = 'customer-dashboard.html';
                }
            }
        }
    }

    // Mobile Drawer Handlers
    window.toggleDrawer = function () {
        const drawer = document.getElementById('mobileDrawer') || document.querySelector('.mobile-nav-drawer');
        const backdrop = document.getElementById('drawerBackdrop') || document.querySelector('.mobile-nav-backdrop');
        if (drawer) drawer.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('show');
        document.body.classList.toggle('drawer-open');
    };

    window.toggleMobileSubMenu = function () {
        const subMenu = document.getElementById('mobileSubMenu') || document.querySelector('.mobile-sub-menu');
        const caret = document.getElementById('mobileSubCaret');
        if (subMenu) {
            subMenu.classList.toggle('show');
            if (caret) caret.style.transform = subMenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    };

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            const drawer = document.getElementById('mobileDrawer') || document.querySelector('.mobile-nav-drawer');
            if (drawer && drawer.classList.contains('open')) {
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
