import React, { useState } from "react";
import { 
  Bed, 
  Check, 
  Wrench, 
  Sparkles, 
  RefreshCw, 
  User, 
  Calendar,
  AlertTriangle
} from "lucide-react";

export default function RoomGrid({ rooms, bookings, setRooms, onCheckIn, onCheckoutClick, onLogServiceClick }) {
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Get active guest details for occupied rooms
  const getActiveGuest = (roomNumber) => {
    return bookings.find(b => b.roomNumber === roomNumber && b.status === "Active");
  };

  const handleStatusChange = (roomNumber, newStatus) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.number === roomNumber ? { ...room, status: newStatus } : room
      )
    );
  };

  const roomTypes = ["All", "Standard", "Deluxe", "Executive", "Presidential Suite"];
  const roomStatuses = ["All", "Available", "Occupied", "Cleaning", "Maintenance"];

  const filteredRooms = rooms.filter(room => {
    const matchesStatus = statusFilter === "All" || room.status === statusFilter;
    const matchesType = typeFilter === "All" || room.type === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Filtering Header */}
      <div className="room-filters glass-card" style={{ padding: "16px 24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="form-label" style={{ fontSize: "11px" }}>Filter by Status</span>
          <div className="filter-group">
            {roomStatuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`filter-btn ${statusFilter === status ? "active" : ""}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span className="form-label" style={{ fontSize: "11px" }}>Filter by Category</span>
          <div className="filter-group">
            {roomTypes.map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`filter-btn ${typeFilter === type ? "active" : ""}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="room-grid">
        {filteredRooms.map(room => {
          const activeGuest = getActiveGuest(room.number);
          
          return (
            <div key={room.number} className="glass-card room-card">
              <div className="room-header">
                <span className="room-number">#{room.number}</span>
                <span className={`room-badge ${room.status.toLowerCase()}`}>
                  {room.status}
                </span>
              </div>

              <div className="room-body">
                <span className="room-type">{room.type}</span>
                <span className="room-price">
                  ₹<span>{room.price}</span> / night
                </span>
                
                {/* Guest Details block if Occupied */}
                {room.status === "Occupied" && activeGuest ? (
                  <div className="room-guest">
                    <User size={13} className="text-secondary" />
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {activeGuest.guestName}
                    </span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} style={{ 
                        fontSize: "9px", 
                        backgroundColor: "rgba(255,255,255,0.03)", 
                        border: "1px solid var(--border-color)", 
                        color: "var(--text-secondary)",
                        padding: "2px 6px",
                        borderRadius: "10px"
                      }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="room-actions">
                {room.status === "Available" && (
                  <button 
                    onClick={() => onCheckIn(room)}
                    className="btn btn-primary"
                  >
                    Check-In
                  </button>
                )}

                {room.status === "Occupied" && activeGuest && (
                  <>
                    <button 
                      onClick={() => onLogServiceClick(activeGuest)}
                      className="btn btn-outline"
                      title="Add Services"
                    >
                      + Service
                    </button>
                    <button 
                      onClick={() => onCheckoutClick(activeGuest)}
                      className="btn btn-secondary"
                    >
                      Check-Out
                    </button>
                  </>
                )}

                {room.status === "Cleaning" && (
                  <button 
                    onClick={() => handleStatusChange(room.number, "Available")}
                    className="btn btn-outline"
                    style={{ color: "var(--success)" }}
                  >
                    <Check size={14} /> Finish Cleaning
                  </button>
                )}

                {room.status === "Maintenance" && (
                  <button 
                    onClick={() => handleStatusChange(room.number, "Available")}
                    className="btn btn-outline"
                    style={{ color: "var(--success)" }}
                  >
                    <Check size={14} /> Resolve Issue
                  </button>
                )}

                {/* State Toggler for staff flexibility */}
                {room.status !== "Occupied" && (
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room.number, e.target.value)}
                    style={{
                      fontSize: "11px",
                      background: "var(--bg-input)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "var(--radius-sm)",
                      padding: "4px",
                      marginLeft: "auto",
                      outline: "none"
                    }}
                  >
                    <option value="Available">Available</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
