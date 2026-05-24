import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import RoomGrid from "./components/RoomGrid";
import BookingManager from "./components/BookingManager";
import ServiceLogger from "./components/ServiceLogger";
import StaffPortal from "./components/StaffPortal";
import InvoiceView from "./components/InvoiceView";
import { Menu } from "lucide-react";

import { 
  INITIAL_ROOMS, 
  INITIAL_BOOKINGS, 
  INITIAL_TASKS 
} from "./mockData";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Load from LocalStorage or fallback to seed mock data
  const [rooms, setRooms] = useState(() => {
    const savedRooms = localStorage.getItem("grandstay_rooms");
    return savedRooms ? JSON.parse(savedRooms) : INITIAL_ROOMS;
  });

  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem("grandstay_bookings");
    return savedBookings ? JSON.parse(savedBookings) : INITIAL_BOOKINGS;
  });

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("grandstay_tasks");
    return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS;
  });

  // Flow State
  const [preselectedRoom, setPreselectedRoom] = useState(null);
  const [preselectedBooking, setPreselectedBooking] = useState(null);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [checkoutBooking, setCheckoutBooking] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync to LocalStorage on modifications
  useEffect(() => {
    localStorage.setItem("grandstay_rooms", JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem("grandstay_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("grandstay_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Operations
  const handleAddBooking = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    
    // Set Room status to Occupied
    setRooms((prevRooms) => 
      prevRooms.map((r) => 
        r.number === newBooking.roomNumber ? { ...r, status: "Occupied" } : r
      )
    );
  };

  const handleConfirmCheckout = (bookingId, roomNumber, finalAmount, paymentMethod) => {
    // 1. Mark Room as "Cleaning"
    setRooms((prevRooms) => 
      prevRooms.map((r) => 
        r.number === roomNumber ? { ...r, status: "Cleaning" } : r
      )
    );

    // 2. Mark Booking as Checked Out and Paid
    setBookings((prevBookings) => 
      prevBookings.map((b) => 
        b.id === bookingId 
          ? { ...b, status: "Checked Out", billingStatus: "Paid", grandTotal: finalAmount, checkOutDate: new Date().toISOString().split("T")[0] } 
          : b
      )
    );

    // 3. Create Housekeeping task automatically
    const housekeepers = ["Sunil Verma", "Pooja Mishra"];
    const randomHousekeeper = housekeepers[Math.floor(Math.random() * housekeepers.length)];
    const newCleaningTask = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      roomNumber: roomNumber,
      assignedStaff: randomHousekeeper,
      priority: "High",
      status: "Pending",
      date: new Date().toISOString(),
      note: `Post checkout thorough deep clean & sanitation for new arrivals.`
    };
    setTasks((prev) => [newCleaningTask, ...prev]);

    // Close checkout billing screen
    setCheckoutBooking(null);
    setActiveTab("rooms"); // Redirect to check room status
  };

  // Switchers & Navigators
  const handleCheckInRedirect = (room) => {
    setPreselectedRoom(room);
    setActiveTab("bookings");
    setShowCheckInForm(true);
  };

  const handleCheckoutRedirect = (booking) => {
    setCheckoutBooking(booking);
  };

  const handleLogServiceRedirect = (booking) => {
    setPreselectedBooking(booking);
    setActiveTab("services");
  };

  const handleQuickCheckInRedirect = () => {
    setPreselectedRoom(null);
    setActiveTab("bookings");
    setShowCheckInForm(true);
  };

  return (
    <div className="app-container">
      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Menu size={24} />
        </button>
        <span className="logo-text" style={{ fontSize: "18px", fontWeight: 700 }}>Grand Stay</span>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Premium Navigation Sidebar */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main View Area */}
      <main className="main-content">
        
        {/* Header Block */}
        <header className="page-header">
          <div className="page-title">
            <h1>
              {activeTab === "dashboard" && "Hotel Overview"}
              {activeTab === "rooms" && "Rooms Layout Directory"}
              {activeTab === "bookings" && "Booking Registry"}
              {activeTab === "services" && "Amenities & Service Logging"}
              {activeTab === "staff" && "Housekeeping & Task Management"}
            </h1>
            <p>
              {activeTab === "dashboard" && "Real-time analytics and overview desk"}
              {activeTab === "rooms" && "Live status indicators and custom room triggers"}
              {activeTab === "bookings" && "Manage check-ins, guest forms, and reservations"}
              {activeTab === "services" && "Bill extra amenities directly to occupants' room bills"}
              {activeTab === "staff" && "Monitor shifts, schedule cleanings, and active work orders"}
            </p>
          </div>
          
          <div className="header-actions">
            <span style={{ 
              fontSize: "12px", 
              color: "var(--text-secondary)", 
              backgroundColor: "var(--bg-secondary)", 
              border: "1px solid var(--border-color)", 
              padding: "6px 12px", 
              borderRadius: "20px", 
              fontWeight: 500,
              alignSelf: "center"
            }}>
              System Time: {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Tab Views */}
        {activeTab === "dashboard" && (
          <Dashboard 
            rooms={rooms} 
            bookings={bookings} 
            tasks={tasks} 
            setActiveTab={setActiveTab} 
            onQuickCheckIn={handleQuickCheckInRedirect}
          />
        )}

        {activeTab === "rooms" && (
          <RoomGrid 
            rooms={rooms} 
            bookings={bookings} 
            setRooms={setRooms} 
            onCheckIn={handleCheckInRedirect}
            onCheckoutClick={handleCheckoutRedirect}
            onLogServiceClick={handleLogServiceRedirect}
          />
        )}

        {activeTab === "bookings" && (
          <BookingManager 
            bookings={bookings} 
            rooms={rooms} 
            onAddBooking={handleAddBooking} 
            onCheckoutClick={handleCheckoutRedirect}
            showCheckInForm={showCheckInForm}
            setShowCheckInForm={setShowCheckInForm}
            preselectedRoom={preselectedRoom}
            setPreselectedRoom={setPreselectedRoom}
          />
        )}

        {activeTab === "services" && (
          <ServiceLogger 
            bookings={bookings} 
            setBookings={setBookings} 
            preselectedBooking={preselectedBooking} 
            setPreselectedBooking={setPreselectedBooking}
          />
        )}

        {activeTab === "staff" && (
          <StaffPortal 
            rooms={rooms} 
            setRooms={setRooms} 
            tasks={tasks} 
            setTasks={setTasks} 
          />
        )}

      </main>

      {/* Bill Checkout Overlay Modal */}
      {checkoutBooking && (
        <InvoiceView 
          booking={checkoutBooking} 
          onClose={() => setCheckoutBooking(null)} 
          onConfirmCheckout={handleConfirmCheckout}
        />
      )}

    </div>
  );
}
