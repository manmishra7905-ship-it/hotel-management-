import React, { useState } from "react";
import { 
  Printer, 
  Check, 
  X, 
  CreditCard, 
  FileText 
} from "lucide-react";

export default function InvoiceView({ booking, onClose, onConfirmCheckout }) {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [isPaid, setIsPaid] = useState(false);

  if (!booking) return null;

  const servicesTotal = booking.servicesBilled ? booking.servicesBilled.reduce((sum, s) => sum + s.price, 0) : 0;
  const subtotal = booking.roomCharge + servicesTotal;
  const discount = booking.discount || 0;
  
  // Calculate 12% GST tax dynamically
  const gstAmount = Math.round((subtotal - discount) * 0.12);
  const finalAmount = Math.max(0, subtotal - discount + gstAmount);

  const handleCheckout = () => {
    setIsPaid(true);
    // Trigger callback to finalize checkout state in parent App.jsx
    setTimeout(() => {
      onConfirmCheckout(booking.id, booking.roomNumber, finalAmount, paymentMethod);
    }, 1000);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content" style={{ maxWidth: "840px", width: "100%", padding: "20px" }}>
        
        {/* Controls (Non-printable) */}
        <div className="invoice-controls">
          <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={20} className="text-secondary" /> Guest Checkout Invoice
          </h3>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={() => window.print()}
              className="btn btn-outline"
            >
              <Printer size={16} /> Print Bill
            </button>
            <button 
              onClick={onClose}
              className="btn btn-outline"
              style={{ padding: "8px" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="invoice-wrapper" style={{ marginTop: "12px" }}>
          <div className="invoice-sheet">
            
            {/* Header */}
            <div className="invoice-header">
              <div className="invoice-logo-block">
                <span className="invoice-logo-title">GRAND STAY</span>
                <span className="invoice-logo-sub">Hotel & Resorts</span>
              </div>
              <div className="invoice-meta">
                <span>INVOICE:</span> #{booking.id}<br />
                <span>DATE:</span> {new Date().toLocaleDateString()}<br />
                <span>GSTIN:</span> 09AAACG1209B1ZN<br />
                <span>STATUS:</span> <strong style={{ color: isPaid ? "#10b981" : "#ef4444" }}>{isPaid ? "PAID" : "PENDING"}</strong>
              </div>
            </div>

            {/* Billing details info */}
            <div className="invoice-billing-details">
              <div>
                <span className="invoice-col-title">Guest Registry</span>
                <div className="invoice-col-val">
                  <strong>{booking.guestName}</strong><br />
                  Phone: {booking.guestPhone}<br />
                  Email: {booking.guestEmail || "N/A"}<br />
                  ID Proof: {booking.guestIdProof}
                </div>
              </div>
              <div>
                <span className="invoice-col-title">Stay & Booking</span>
                <div className="invoice-col-val">
                  Room Number: <strong>{booking.roomNumber}</strong><br />
                  Check-In: {booking.checkInDate}<br />
                  Check-Out: {booking.checkOutDate}<br />
                  Nights: {booking.totalDays} Night{booking.totalDays > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Line items table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Billing Items</th>
                  <th className="num">Unit Price</th>
                  <th className="num">Qty/Nights</th>
                  <th className="num">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Base Lodging Fee (Room Rent)</td>
                  <td className="num">₹{(booking.roomCharge / booking.totalDays).toLocaleString()}</td>
                  <td className="num">{booking.totalDays}</td>
                  <td className="num">₹{booking.roomCharge.toLocaleString()}</td>
                </tr>
                {booking.servicesBilled && booking.servicesBilled.map((srv) => (
                  <tr key={srv.id}>
                    <td>{srv.name}</td>
                    <td className="num">₹{srv.price.toLocaleString()}</td>
                    <td className="num">1</td>
                    <td className="num">₹{srv.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Section */}
            <div className="invoice-totals">
              <div className="invoice-total-row">
                <span>Subtotal:</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="invoice-total-row" style={{ color: "#b91c1c" }}>
                  <span>Discounts Applied:</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="invoice-total-row">
                <span>GST / Luxury Tax (12%):</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="invoice-total-row grand">
                <span>Grand Total:</span>
                <span>₹{finalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Fine print footer */}
            <div className="invoice-footer-message">
              Thank you for choosing Grand Stay Hotel! We hope your stay was delightful.<br />
              For any queries, contact support@grandstay.com or call +91 99887-76655.
            </div>

          </div>
        </div>

        {/* Checkout actions control panel (Non-printable) */}
        {!isPaid && (
          <div className="glass-card" style={{ marginTop: "24px", border: "1px solid var(--border-color)", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span className="form-label" style={{ fontSize: "11px" }}>Payment Method:</span>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-input"
                style={{ width: "auto", padding: "6px 12px", fontSize: "13px" }}
              >
                <option value="Credit Card">Credit/Debit Card</option>
                <option value="UPI / QR Code">UPI (GPay/PhonePe/Paytm)</option>
                <option value="Cash">Cash payment</option>
                <option value="Corporate Bill">Corporate Billing</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleCheckout}
                className="btn btn-secondary"
                style={{ background: "linear-gradient(135deg, var(--success), #059669)", boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)" }}
              >
                <Check size={16} /> Process Checkout & Paid
              </button>
            </div>
          </div>
        )}

        {isPaid && (
          <div style={{ 
            marginTop: "24px", 
            padding: "16px", 
            borderRadius: "var(--radius-md)", 
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            color: "var(--success)",
            fontWeight: 700
          }}>
            <CreditCard className="animate-pulse" /> Processing Payment & Cleaning Checklist Activated...
          </div>
        )}

      </div>
    </div>
  );
}
