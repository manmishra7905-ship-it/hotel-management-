import React, { useState } from "react";
import { 
  Coffee, 
  Plus, 
  Trash, 
  Utensils, 
  Sparkles, 
  Shirt, 
  Car, 
  Wine, 
  Bell 
} from "lucide-react";
import { SERVICES_CATALOG } from "../mockData";

export default function ServiceLogger({ bookings, setBookings, preselectedBooking, setPreselectedBooking }) {
  const activeBookings = bookings.filter(b => b.status === "Active");
  
  const [selectedBookingId, setSelectedBookingId] = useState(
    preselectedBooking ? preselectedBooking.id : (activeBookings[0]?.id || "")
  );

  // Auto-align when preselectedBooking changes
  React.useEffect(() => {
    if (preselectedBooking) {
      setSelectedBookingId(preselectedBooking.id);
    }
  }, [preselectedBooking]);

  const currentBooking = bookings.find(b => b.id === selectedBookingId);

  const getServiceIcon = (iconName) => {
    switch (iconName) {
      case "Utensils": return <Utensils size={18} />;
      case "Sparkles": return <Sparkles size={18} />;
      case "Shirt": return <Shirt size={18} />;
      case "Car": return <Car size={18} />;
      case "Wine": return <Wine size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const handleAddService = (service) => {
    if (!selectedBookingId) {
      alert("Please select a room/guest first.");
      return;
    }

    const serviceCharge = {
      id: `${service.id}-${Date.now()}`,
      name: service.name,
      price: service.price,
      date: new Date().toISOString()
    };

    setBookings(prevBookings => 
      prevBookings.map(b => {
        if (b.id === selectedBookingId) {
          const updatedServices = [...(b.servicesBilled || []), serviceCharge];
          const newServicesTotal = updatedServices.reduce((sum, s) => sum + s.price, 0);
          const grandTotal = b.roomCharge + newServicesTotal - b.discount;
          return { 
            ...b, 
            servicesBilled: updatedServices,
            grandTotal 
          };
        }
        return b;
      })
    );
  };

  const handleDeleteService = (chargeId) => {
    setBookings(prevBookings => 
      prevBookings.map(b => {
        if (b.id === selectedBookingId) {
          const updatedServices = b.servicesBilled.filter(s => s.id !== chargeId);
          const newServicesTotal = updatedServices.reduce((sum, s) => sum + s.price, 0);
          const grandTotal = b.roomCharge + newServicesTotal - b.discount;
          return { 
            ...b, 
            servicesBilled: updatedServices,
            grandTotal
          };
        }
        return b;
      })
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="service-logs-grid">
        {/* Left Side: Services Catalog */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Coffee size={18} className="text-secondary" /> Premium Services Catalog
          </h3>
          <div className="services-list-compact">
            {SERVICES_CATALOG.map((service) => (
              <button
                key={service.id}
                onClick={() => handleAddService(service)}
                className="service-item-btn"
                style={{ width: "100%" }}
              >
                <span className="service-item-name">
                  {getServiceIcon(service.icon)}
                  {service.name}
                </span>
                <span className="service-item-price">₹{service.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Active Room Selection & Logged Charges */}
        <div className="glass-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
            <h3>Billed Services for Room</h3>
            
            <select
              value={selectedBookingId}
              onChange={(e) => {
                setSelectedBookingId(e.target.value);
                setPreselectedBooking(null);
              }}
              className="form-input"
              style={{ width: "auto", minWidth: "240px" }}
            >
              <option value="" disabled>-- Select Guest Room --</option>
              {activeBookings.map(b => (
                <option key={b.id} value={b.id}>
                  Room {b.roomNumber} - {b.guestName}
                </option>
              ))}
            </select>
          </div>

          {currentBooking ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Account Quick Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", backgroundColor: "rgba(255,255,255,0.01)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="form-label" style={{ fontSize: "10px" }}>Guest</span>
                  <span style={{ fontWeight: 600, color: "#fff" }}>{currentBooking.guestName}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="form-label" style={{ fontSize: "10px" }}>Days Stayed</span>
                  <span style={{ fontWeight: 600, color: "#fff" }}>{currentBooking.totalDays} Night{currentBooking.totalDays > 1 ? "s" : ""}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span className="form-label" style={{ fontSize: "10px" }}>Room Rent</span>
                  <span style={{ fontWeight: 600, color: "var(--secondary)" }}>₹{currentBooking.roomCharge}</span>
                </div>
              </div>

              {/* Billed List */}
              <h4 style={{ fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-secondary)", marginTop: "10px" }}>
                Itemized Service Sheet
              </h4>

              {(!currentBooking.servicesBilled || currentBooking.servicesBilled.length === 0) ? (
                <div style={{ padding: "30px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-muted)", fontSize: "13px" }}>
                  No services billed yet. Click catalog items on the left to add items to room.
                </div>
              ) : (
                <div className="table-responsive" style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Item Description</th>
                        <th style={{ textAlign: "right" }}>Charge</th>
                        <th style={{ textAlign: "center" }}>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBooking.servicesBilled.map((srv) => (
                        <tr key={srv.id}>
                          <td style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            {new Date(srv.date).toLocaleDateString()} {new Date(srv.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ fontWeight: 600 }}>{srv.name}</td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "var(--secondary)" }}>
                            ₹{srv.price}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", padding: "4px" }}
                            >
                              <Trash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Total Calculations */}
              <div style={{ alignSelf: "flex-end", display: "flex", flexDirection: "column", gap: "6px", width: "240px", borderTop: "2px solid var(--border-color)", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-secondary)" }}>
                  <span>Room Charge:</span>
                  <span>₹{currentBooking.roomCharge.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-secondary)" }}>
                  <span>Services Subtotal:</span>
                  <span>₹{(currentBooking.servicesBilled ? currentBooking.servicesBilled.reduce((sum, s) => sum + s.price, 0) : 0).toLocaleString()}</span>
                </div>
                {currentBooking.discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--danger)" }}>
                    <span>Discounts:</span>
                    <span>- ₹{currentBooking.discount.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: "#fff", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                  <span>Total Bill:</span>
                  <span style={{ color: "var(--success)" }}>₹{currentBooking.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              No active occupant rooms available for service logging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
