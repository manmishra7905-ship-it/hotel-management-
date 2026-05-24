import React from "react";
import { 
  DollarSign, 
  Bed, 
  Users, 
  ClipboardList, 
  Activity, 
  Utensils, 
  Sparkles, 
  Car, 
  CheckCircle,
  Clock
} from "lucide-react";

export default function Dashboard({ rooms, bookings, staff, tasks, setActiveTab, onQuickCheckIn }) {
  // Calculations
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "Occupied").length;
  const availableRooms = rooms.filter(r => r.status === "Available").length;
  const cleaningRooms = rooms.filter(r => r.status === "Cleaning").length;
  const maintenanceRooms = rooms.filter(r => r.status === "Maintenance").length;
  
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  
  // Calculate revenue from active and completed bookings
  const revenueTotal = bookings.reduce((sum, b) => {
    const servicesCost = b.servicesBilled ? b.servicesBilled.reduce((sSum, s) => sSum + s.price, 0) : 0;
    const roomCost = b.roomCharge || 0;
    const discount = b.discount || 0;
    return sum + (roomCost + servicesCost - discount);
  }, 0);

  const activeCheckIns = bookings.filter(b => b.status === "Active").length;
  const pendingCleaning = tasks.filter(t => t.status !== "Completed").length;

  // Mocked weekly occupancy data for the beautiful chart
  const weeklyData = [
    { day: "Mon", rate: 45 },
    { day: "Tue", rate: 58 },
    { day: "Wed", rate: 62 },
    { day: "Thu", rate: 55 },
    { day: "Fri", rate: 78 },
    { day: "Sat", rate: 90 },
    { day: "Sun", rate: 85 }
  ];

  // Activities feed
  const recentActivities = [
    { id: 1, type: "success", text: "Room 202 checked in successfully - Neha Sen", time: "10 mins ago" },
    { id: 2, type: "primary", text: "Room Service logged for Room 102 - 1x Fine Dining (Rs 450)", time: "25 mins ago" },
    { id: 3, type: "warning", text: "Room 203 moved to Maintenance - AC Unit Leakage", time: "1 hour ago" },
    { id: 4, type: "success", text: "Room 103 cleaned by Housekeeper Sunil Verma", time: "2 hours ago" },
    { id: 5, type: "primary", text: "Booking created for Room 402 (Presidential Suite)", time: "3 hours ago" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Upper Cards */}
      <div className="stats-grid">
        <div className="glass-card stat-card primary">
          <div className="stat-details">
            <span className="stat-label">Occupancy Rate</span>
            <span className="stat-value">{occupancyRate}%</span>
            <span className="stat-change up">
              <Clock size={12} /> {occupiedRooms} / {totalRooms} Rooms Booked
            </span>
          </div>
          <div className="stat-icon-box">
            <Bed size={22} />
          </div>
        </div>

        <div className="glass-card stat-card success">
          <div className="stat-details">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{revenueTotal.toLocaleString()}</span>
            <span className="stat-change up">
              +12.4% from last week
            </span>
          </div>
          <div className="stat-icon-box">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="glass-card stat-card warning">
          <div className="stat-details">
            <span className="stat-label">Active Guests</span>
            <span className="stat-value">{activeCheckIns}</span>
            <span className="stat-change up">
              In-house occupants
            </span>
          </div>
          <div className="stat-icon-box">
            <Users size={22} />
          </div>
        </div>

        <div className="glass-card stat-card secondary">
          <div className="stat-details">
            <span className="stat-label">Pending Service Tasks</span>
            <span className="stat-value">{pendingCleaning}</span>
            <span className="stat-change down">
              Cleaning & Maintenance
            </span>
          </div>
          <div className="stat-icon-box">
            <ClipboardList size={22} />
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="analytics-grid">
        {/* Custom CSS Chart Card */}
        <div className="glass-card">
          <div className="chart-header">
            <h3>Weekly Occupancy Analysis</h3>
            <span className="stat-label" style={{ fontSize: '11px' }}>May 18 - May 24</span>
          </div>
          
          <div className="occupancy-chart">
            {weeklyData.map((item, index) => (
              <div key={index} className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ height: `${item.rate}%`, width: '32px' }}
                >
                  <span className="chart-bar-tooltip">{item.rate}% Occupied</span>
                </div>
                <span className="chart-label">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} className="text-primary" /> Live Hotel Activities
          </h3>
          <div className="activity-list">
            {recentActivities.map((act) => (
              <div key={act.id} className="activity-item">
                <div className={`activity-indicator ${act.type}`} />
                <div className="activity-info">
                  <span className="activity-desc">{act.text}</span>
                  <span className="activity-time">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action deck */}
      <div>
        <h3 style={{ marginBottom: '16px' }}>Reception Quick Desk</h3>
        <div className="quick-actions-panel">
          <div className="glass-card action-card" onClick={onQuickCheckIn}>
            <h3 style={{ color: 'var(--primary)' }}>
              <Users size={18} /> New Guest Check-In
            </h3>
            <p>Book a room, enter guest details, and check them in instantly with automated receipts.</p>
          </div>

          <div className="glass-card action-card" onClick={() => setActiveTab("rooms")}>
            <h3 style={{ color: 'var(--success)' }}>
              <Bed size={18} /> Rooms Directory
            </h3>
            <p>Check live room status catalog, update room configurations, or toggle housekeeping alerts.</p>
          </div>

          <div className="glass-card action-card" onClick={() => setActiveTab("services")}>
            <h3 style={{ color: 'var(--secondary)' }}>
              <Utensils size={18} /> Add Service Charge
            </h3>
            <p>Order food, log spa treatments, or bill laundry services directly to any occupied room.</p>
          </div>

          <div className="glass-card action-card" onClick={() => setActiveTab("staff")}>
            <h3 style={{ color: 'var(--info)' }}>
              <ClipboardList size={18} /> Housekeeping Desk
            </h3>
            <p>Assign cleaning schedules to active staff members and track room repair tasks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
