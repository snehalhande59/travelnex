/**
 * TRAVELNEX - Common Utilities & UI Helpers
 * Toast notifications, confirmation modals, formatters and invoice generation.
 */

const Utils = {
    // Show Modern Toast Notification
    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-circle-exclamation',
            warning: 'fa-triangle-exclamation',
            info: 'fa-circle-info'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type] || icons.info} toast-icon"></i>
            <span style="flex:1;">${this.escapeHTML(message)}</span>
        `;

        container.appendChild(toast);
        // Trigger animation
        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    },

    // Confirm Dialog Helper
    confirm(message, onConfirm, onCancel = null) {
        let overlay = document.getElementById('travelnex-confirm-modal');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'travelnex-confirm-modal';
            overlay.className = 'modal-overlay';
            overlay.innerHTML = `
                <div class="modal-container" style="max-width: 420px; text-align: center; padding: 28px;">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: #fff2ea; color: var(--orange); display: grid; place-items: center; font-size: 24px; margin: 0 auto 16px;">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h3 style="font-size: 19px; color: var(--navy); margin-bottom: 8px;">Are you sure?</h3>
                    <p id="confirm-modal-msg" style="font-size: 13.5px; color: var(--text-muted); margin-bottom: 24px;"></p>
                    <div style="display: flex; gap: 12px; justify-content: center;">
                        <button type="button" id="confirm-modal-cancel" class="btn btn-outline" style="min-width: 100px;">Cancel</button>
                        <button type="button" id="confirm-modal-ok" class="btn btn-primary" style="min-width: 100px;">Confirm</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        const msgEl = overlay.querySelector('#confirm-modal-msg');
        msgEl.textContent = message;

        const cancelBtn = overlay.querySelector('#confirm-modal-cancel');
        const okBtn = overlay.querySelector('#confirm-modal-ok');

        const closeConfirm = () => {
            overlay.classList.remove('active');
        };

        cancelBtn.onclick = () => {
            closeConfirm();
            if (onCancel) onCancel();
        };

        okBtn.onclick = () => {
            closeConfirm();
            if (onConfirm) onConfirm();
        };

        overlay.classList.add('active');
    },

    // Escape HTML to prevent XSS
    escapeHTML(str) {
        if (!str) return '';
        return String(str).replace(/[&<>"']/g, match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[match]);
    },

    // Currency Formatter
    formatCurrency(amount) {
        const num = Number(amount) || 0;
        return '₹' + num.toLocaleString('en-IN');
    },

    // Date & Time Formatter
    formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    formatDateTime(isoStr) {
        if (!isoStr) return 'N/A';
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return isoStr;
        return d.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Get Status Badge HTML
    getStatusBadge(status) {
        const s = (status || 'Pending').toLowerCase();
        let cls = 'badge-pending';
        let icon = 'fa-clock';

        if (s === 'confirmed') {
            cls = 'badge-confirmed';
            icon = 'fa-check';
        } else if (s === 'in progress' || s === 'started') {
            cls = 'badge-progress';
            icon = 'fa-spinner fa-spin';
        } else if (s === 'completed') {
            cls = 'badge-completed';
            icon = 'fa-circle-check';
        } else if (s === 'cancelled' || s === 'rejected') {
            cls = 'badge-cancelled';
            icon = 'fa-ban';
        }

        return `<span class="badge ${cls}"><i class="fa-solid ${icon}"></i> ${this.escapeHTML(status)}</span>`;
    },

    // Printable Invoice Modal View
    showInvoiceModal(bookingId) {
        let invoice = StorageManager.getInvoiceByBookingId(bookingId);
        if (!invoice) {
            invoice = StorageManager.generateInvoiceForBooking(bookingId);
        }

        if (!invoice) {
            this.showToast('Unable to find or generate invoice for this booking.', 'error');
            return;
        }

        const booking = StorageManager.getBookingById(bookingId) || {};
        const settings = StorageManager.getSettings();

        let modal = document.getElementById('travelnex-invoice-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'travelnex-invoice-modal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal-container modal-lg">
                <div class="modal-header no-print">
                    <h3 class="modal-title">Tax Invoice – ${this.escapeHTML(invoice.id)}</h3>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" class="btn btn-primary btn-sm" onclick="window.print()">
                            <i class="fa-solid fa-print"></i> Print / Save PDF
                        </button>
                        <button type="button" class="modal-close-btn" onclick="document.getElementById('travelnex-invoice-modal').classList.remove('active')">&times;</button>
                    </div>
                </div>
                <div class="modal-body" style="background: #fff;">
                    <div class="invoice-sheet">
                        <div class="invoice-header-row">
                            <div class="invoice-brand">
                                <h2>TRAVEL<span>NEX</span></h2>
                                <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
                                    ${this.escapeHTML(settings.companyName || 'TRAVELNEX Mobility Solutions Pvt Ltd')}<br>
                                    ${this.escapeHTML(settings.officeAddress || 'Senapati Bapat Road, Pune 411016')}<br>
                                    GSTIN: <strong>${this.escapeHTML(settings.gstin || '27AAACT9999P1Z3')}</strong><br>
                                    Phone: ${this.escapeHTML(settings.supportPhone || '+91 1800 200 8989')}
                                </p>
                            </div>
                            <div class="invoice-meta">
                                <h3>TAX INVOICE</h3>
                                <p style="font-size: 13px;">Invoice No: <strong>${this.escapeHTML(invoice.id)}</strong></p>
                                <p style="font-size: 13px;">Date: ${this.formatDate(invoice.issuedDate)}</p>
                                <p style="font-size: 13px;">Booking ID: <strong>${this.escapeHTML(booking.id || invoice.bookingId)}</strong></p>
                                <div style="margin-top: 8px;">
                                    <span class="badge ${invoice.status === 'Paid' ? 'badge-paid' : 'badge-unpaid'}">
                                        Payment: ${this.escapeHTML(invoice.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="invoice-parties">
                            <div class="party-box">
                                <div class="party-title">Billed To</div>
                                <p>
                                    <strong>${this.escapeHTML(invoice.customerName || booking.customerName || 'Customer')}</strong><br>
                                    ${booking.corporateId ? `<strong>Corporate Account:</strong> ${this.escapeHTML(invoice.companyName || 'Corporate Client')}<br>` : ''}
                                    Email: ${this.escapeHTML(invoice.customerEmail || booking.customerEmail || 'N/A')}<br>
                                    Mobile: ${this.escapeHTML(invoice.customerPhone || booking.customerPhone || 'N/A')}
                                </p>
                            </div>
                            <div class="party-box">
                                <div class="party-title">Journey Details</div>
                                <p>
                                    <strong>Service:</strong> ${this.escapeHTML(booking.serviceType || 'Cab Booking')}<br>
                                    <strong>Route:</strong> ${this.escapeHTML(booking.pickup || 'Pickup')} &rarr; ${this.escapeHTML(booking.destination || 'Destination')}<br>
                                    <strong>Travel Date & Time:</strong> ${this.formatDate(booking.journeyDate)} at ${this.escapeHTML(booking.journeyTime || '--:--')}<br>
                                    <strong>Vehicle Type:</strong> ${this.escapeHTML(booking.vehicleType || 'Sedan')}
                                </p>
                            </div>
                        </div>

                        <table class="invoice-items-table">
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th>Service Type</th>
                                    <th style="text-align: right;">Base Fare</th>
                                    <th style="text-align: right;">GST (18%)</th>
                                    <th style="text-align: right;">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <strong>Mobility & Travel Service Charges</strong><br>
                                        <span style="font-size: 11.5px; color: var(--text-muted);">${this.escapeHTML(booking.pickup)} to ${this.escapeHTML(booking.destination)}</span>
                                    </td>
                                    <td>${this.escapeHTML(booking.serviceType || 'Travel')}</td>
                                    <td style="text-align: right;">${this.formatCurrency(invoice.baseFare)}</td>
                                    <td style="text-align: right;">${this.formatCurrency(invoice.taxes)}</td>
                                    <td style="text-align: right;"><strong>${this.formatCurrency(invoice.totalAmount)}</strong></td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="invoice-total-row">
                            <div class="invoice-total-box">
                                <div class="total-line">
                                    <span>Subtotal (Base):</span>
                                    <span>${this.formatCurrency(invoice.baseFare)}</span>
                                </div>
                                <div class="total-line">
                                    <span>IGST / CGST+SGST (18%):</span>
                                    <span>${this.formatCurrency(invoice.taxes)}</span>
                                </div>
                                <div class="total-line grand-total">
                                    <span>Grand Total:</span>
                                    <span>${this.formatCurrency(invoice.totalAmount)}</span>
                                </div>
                            </div>
                        </div>

                        <div class="invoice-notes">
                            <p><strong>Terms & Conditions:</strong></p>
                            <p>This is a computer-generated demonstration invoice issued by TRAVELNEX. In live operation, tax invoices comply with applicable GST rules and travel regulations.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        modal.classList.add('active');
    }
};

// Global shorthand
const showToast = (msg, type) => Utils.showToast(msg, type);

// Global Mobile Drawer Controller
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileBackdrop = document.getElementById('mobileNavBackdrop');
    const mobileClose = document.getElementById('mobileNavClose');

    const openDrawer = () => {
        if (mobileDrawer) mobileDrawer.classList.add('open');
        if (mobileBackdrop) mobileBackdrop.classList.add('show');
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (mobileBackdrop) mobileBackdrop.classList.remove('show');
        document.body.style.overflow = '';
    };

    if (navToggle) navToggle.addEventListener('click', openDrawer);
    if (mobileClose) mobileClose.addEventListener('click', closeDrawer);
    if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeDrawer);
});
