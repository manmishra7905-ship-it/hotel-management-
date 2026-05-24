import React, { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  CreditCard,
  Mail, 
  Phone,
  User,
  X
} from "lucide-react";

export default function BookingManager({ 
  bookings, 
  rooms, 
  onAddBooking, 
  onCheckoutClick, 
  showCheckInForm, 
  setShowCheckInForm,
  preselectedRoom,
  setPreselectedRoom
}) {
  const [activeTab, setActiveTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Check-In Form Fields
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [idType, setIdType] = useState("Aadhar");
  const [idNumber, setIdNumber] = useState("");
  const [checkInDate, setCheckInDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkOutDate, setCheckOutDate] = useState("");
  const [discount, setDiscount] = useState(0);

  // Auto-fill dates and handle room selection
  useEffect(() => {
    if (preselectedRoom) {
      setSelectedRoomNumber(preselectedRoom.number);
    } else {
      const availableRooms = rooms.filter(r => r.status === "Available");
      if (availableRooms.length > 0) {
        setSelectedRoomNumber(availableRooms[0].number);
      }
    }
  }, [preselectedRoom, rooms]);

  // Set checkout date to at least 1 day after check-in date
  useEffect(() => {
    if (checkInDate) {
      const checkIn = new Date(checkInDate);
      checkIn.setDate(checkIn.getDate() + 1);
      setCheckOutDate(checkIn.toISOString().split("T")[0]);
    }
  }, [checkInDate]);

  // Calculate live days and rental fee
  const selectedRoom = rooms.find(r => r.number === parseInt(selectedRoomNumber));
  const dailyPrice = selectedRoom ? selectedRoom.price : 0;
  
  let totalDays = 0;
  let roomCharge = 0;
  if (checkInDate && checkOutDate) {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    roomCharge = totalDays * dailyPrice;
  }

  const grandTotal = Math.max(0, roomCharge - discount);

  const handleSubmitCheckIn = (e) => {
    e.preventDefault();
    if (!selectedRoomNumber || !guestName || !guestPhone || !checkOutDate) {
      alert("Please fill in all mandatory fields.");
      return;
    }

    const newBooking = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      roomNumber: parseInt(selectedRoomNumber),
      guestName,
      guestPhone,
      guestEmail,
      guestIdProof: `${idType}: ${idNumber}`,
      checkInDate,
      checkOutDate,
      discount: parseFloat(discount) || 0,
      servicesBilled: [],
      status: "Active",
      billingStatus: "Pending",
      totalDays,
      roomCharge,
      grandTotal
    };

    onAddBooking(newBooking);
    
    // Reset Form
    setGuestName("");
    setGuestPhone("");
    setGuestEmail("");
    setIdNumber("");
    setDiscount(0);
    setPreselectedRoom(null);
    setShowCheckInForm(false);
  };

  const filteredBookings = bookings.filter(b => {
    const isTabMatch = activeTab === "active" ? b.status === "Active" : b.status === "Checked Out";
    
    const query = searchQuery.toLowerCase();
    const isSearchMatch = 
      b.guestName.toLowerCase().includes(query) ||
      b.roomNumber.toString().includes(query) ||
      b.id.toLowerCase().includes(query);

    return isTabMatch && isSearchMatch;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Search and Action Bar */}
      <div className="room-filters glass-card" style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", gap: "12px", width: "100%", maxWidth: "400px", position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search guests, rooms, booking ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "38px" }}
          />
        </div>

        <div className="filter-group" style={{ margin: "8px 0" }}>
          <button
            onClick={() => setActiveTab("active")}
            className={`filter-btn ${activeTab === "active" ? "active" : ""}`}
          >
            Active Check-Ins
          </button>
          <button
            onClick={() => setActiveTab("checked_out")}
            className={`filter-btn ${activeTab === "checked_out" ? "active" : ""}`}
          >
            Checked Out Log
          </button>
        </div>

        <button 
          onClick={() => {
            setPreselectedRoom(null);
            setShowCheckInForm(true);
          }} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Guest Check-In
        </button>
      </div>

      {/* Bookings Table */}
      <div className="glass-card">
        <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={18} className="text-primary" /> 
          {activeTab === "active" ? "Current Guests In-House" : "Checked Out Archives"}
        </h3>
        
        {filteredBookings.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            No bookings found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Room</th>
                  <th>Guest Name</th>
                  <th>Contact Details</th>
                  <th>Dates (In - Out)</th>
                  <th>Billed Service Total</th>
                  <th>Grand Total</th>
                  {activeTab === "active" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const servicesTotal = b.servicesBilled ? b.servicesBilled.reduce((sum, s) => sum + s.price, 0) : 0;
                  const finalAmount = b.roomCharge + servicesTotal - b.discount;
                  
                  return (
                    <tr key={b.id}>
                      <td style={{ fontWeight: 700, color: "var(--primary)" }}>{b.id}</td>
                      <td>
                        <span style={{ 
                          padding: "4px 8px", 
                          borderRadius: "4px", 
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          color: "var(--primary)",
                          fontWeight: 700 
                        }}>
                          Room {b.roomNumber}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{b.guestName}</td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", fontSize: "12px", color: "var(--text-secondary)" }}>
                          <span>{b.guestPhone}</span>
                          <span>{b.guestEmail}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", fontSize: "12px" }}>
                          <span><strong>In:</strong> {b.checkInDate}</span>
                          <span><strong>Out:</strong> {b.checkOutDate}</span>
                          <span style={{ color: "var(--text-muted)" }}>({b.totalDays} {b.totalDays === 1 ? "night" : "nights"})</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: "var(--secondary)" }}>
                        ₹{servicesTotal.toLocaleString()}
                      </td>
                      <td style={{ fontWeight: 800 }}>
                        ₹{finalAmount.toLocaleString()}
                      </td>
                      {activeTab === "active" && (
                        <td>
                          <button
                            onClick={() => onCheckoutClick(b)}
                            className="btn btn-secondary"
                            style={{ padding: "6px 12px", fontSize: "12px" }}
                          >
                            Check-Out
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guest Check-In Modal Wizard */}
      {showCheckInForm && (
        <div className="modal-overlay">
          <div className="glass-card modal-content">
            <button className="modal-close" onClick={() => setShowCheckInForm(false)}>
              <X size={20} />
            </button>

            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Calendar size={20} className="text-primary" /> Guest Check-In Form
            </h3>

            <form onSubmit={handleSubmitCheckIn}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Select Room *</label>
                  <select
                    value={selectedRoomNumber}
                    onChange={(e) => {
                      setSelectedRoomNumber(e.target.value);
                      setPreselectedRoom(null);
                    }}
                    className="form-input"
                    disabled={!!preselectedRoom}
                    required
                  >
                    {preselectedRoom ? (
                      <option value={preselectedRoom.number}>
                        Room {preselectedRoom.number} ({preselectedRoom.type} - ₹{preselectedRoom.price}/N)
                      </option>
                    ) : (
                      rooms
                        .filter(r => r.status === "Available")
                        .map(r => (
                          <option key={r.number} value={r.number}>
                            Room {r.number} ({r.type} - ₹{r.price}/N)
                          </option>
                        ))
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Guest Name *</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="First & Last Name"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Verification ID Type *</label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="Aadhar">Aadhar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="PAN Card">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">ID Document Number *</label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Enter ID Reference"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Check-In Date *</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Check-Out Date *</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Discount Applied (₹)</label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0.00"
                  className="form-input"
                />
              </div>

              {/* Dynamic Rent Calculator Summary */}
              {selectedRoom && (
                <div style={{ 
                  backgroundColor: "rgba(255,255,255,0.02)", 
                  border: "1px solid var(--border-color)", 
                  padding: "16px", 
                  borderRadius: "var(--radius-md)",
                  marginTop: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <span>Room Category:</span>
                    <span style={{ fontWeight: 600, color: "#fff" }}>{selectedRoom.type} (₹{dailyPrice}/night)</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <span>Calculated Nights:</span>
                    <span style={{ fontWeight: 600, color: "#fff" }}>{totalDays} night{totalDays > 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--text-secondary)" }}>
                    <span>Base Room Rent:</span>
                    <span style={{ fontWeight: 600, color: "#fff" }}>₹{roomCharge.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "var(--danger)" }}>
                      <span>Discount Offered:</span>
                      <span>- ₹{discount}</span>
                    </div>
                  )}
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    fontSize: "16px", 
                    fontWeight: 800, 
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: "8px",
                    marginTop: "4px"
                  }}>
                    <span style={{ color: "var(--secondary)" }}>Total Estimated:</span>
                    <span>₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setPreselectedRoom(null);
                    setShowCheckInForm(false);
                  }} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
