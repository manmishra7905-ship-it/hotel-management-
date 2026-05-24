import React from "react";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Coffee, 
  Users, 
  Receipt 
} from "lucide-react";

export default function Navigation({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "rooms", label: "Rooms Grid", icon: BedDouble },
    { id: "bookings", label: "Bookings", icon: CalendarCheck },
    { id: "services", label: "Services Billing", icon: Coffee },
    { id: "staff", label: "Staff & Cleaning", icon: Users },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">H</div>
        <span className="logo-text">Grand Stay</span>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${activeTab === item.id ? "active" : ""}`}
              style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="sidebar-footer">
        <div className="avatar">A</div>
        <div className="user-info">
          <span className="user-name">Admin Portal</span>
          <span className="user-role">Super User</span>
        </div>
      </div>
    </aside>
  );
}
