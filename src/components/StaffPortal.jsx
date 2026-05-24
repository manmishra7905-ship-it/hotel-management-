import React, { useState } from "react";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Wrench, 
  Sparkles, 
  AlertTriangle,
  Play,
  Plus,
  Phone
} from "lucide-react";
import { INITIAL_STAFF } from "../mockData";

export default function StaffPortal({ rooms, setRooms, tasks, setTasks }) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [note, setNote] = useState("");

  const staffList = INITIAL_STAFF;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!selectedRoomNumber || !assignedStaffId) {
      alert("Please select both a Room and a Staff member.");
      return;
    }

    const selectedStaff = staffList.find(s => s.id === assignedStaffId);
    const roomNum = parseInt(selectedRoomNumber);

    const newTask = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      roomNumber: roomNum,
      assignedStaff: selectedStaff.name,
      priority,
      status: "Pending",
      date: new Date().toISOString(),
      note: note || "Regular cleaning check"
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
    
    // Also toggle room status automatically
    setRooms(prevRooms => 
      prevRooms.map(r => {
        if (r.number === roomNum) {
          // If in maintenance, keep it, otherwise mark as Cleaning
          return { ...r, status: r.status === "Maintenance" ? "Maintenance" : "Cleaning" };
        }
        return r;
      })
    );

    // Reset Form
    setSelectedRoomNumber("");
    setAssignedStaffId("");
    setNote("");
    setShowTaskForm(false);
  };

  const handleUpdateTaskStatus = (taskId, roomNumber, nextStatus) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, status: nextStatus } : task
      )
    );

    // Update Room status as well
    if (nextStatus === "In Progress") {
      setRooms(prevRooms => 
        prevRooms.map(r => r.number === roomNumber ? { ...r, status: "Cleaning" } : r)
      );
    } else if (nextStatus === "Completed") {
      setRooms(prevRooms => 
        prevRooms.map(r => r.number === roomNumber ? { ...r, status: "Available" } : r)
      );
    }
  };

  const getPriorityStyle = (p) => {
    switch (p) {
      case "High": return { backgroundColor: "rgba(239, 68, 68, 0.1)", color: "var(--danger)", border: "1px solid rgba(239, 68, 68, 0.2)" };
      case "Medium": return { backgroundColor: "rgba(249, 115, 22, 0.1)", color: "var(--warning)", border: "1px solid rgba(249, 115, 22, 0.2)" };
      default: return { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--success)", border: "1px solid rgba(16, 185, 129, 0.2)" };
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Upper Navigation and Form Trigger */}
      <div className="room-filters glass-card" style={{ padding: "16px 24px" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Users size={20} className="text-primary" /> Housekeeping & Maintenance Roster
        </h3>
        <button 
          onClick={() => setShowTaskForm(true)} 
          className="btn btn-primary"
        >
          <Plus size={16} /> Assign Housekeeping Task
        </button>
      </div>

      <div className="staff-tasks-grid">
        {/* Left Hand: Staff Directory List */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "18px" }}>Active Hotel Staff</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((stf) => (
                  <tr key={stf.id}>
                    <td style={{ fontWeight: 700, color: "var(--text-muted)" }}>{stf.id}</td>
                    <td style={{ fontWeight: 600 }}>{stf.name}</td>
                    <td>{stf.role}</td>
                    <td>
                      <span className="badge-status completed" style={{ fontSize: "9px" }}>
                        {stf.status}
                      </span>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={12} /> {stf.phone}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Hand: Active Cleaning & Maintenance Tasks */}
        <div className="glass-card">
          <h3 style={{ marginBottom: "6px" }}>Work Orders & Cleaning Tasks</h3>
          <div className="task-list">
            {tasks.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "var(--radius-md)", color: "var(--text-muted)" }}>
                No active housekeeping work orders found.
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-details">
                    <span className="task-title" style={{ fontSize: "15px" }}>
                      Room {task.roomNumber} - <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{task.assignedStaff}</span>
                    </span>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{task.note}</p>
                    
                    <div className="task-meta" style={{ marginTop: "6px" }}>
                      <span style={{ 
                        padding: "2px 6px", 
                        borderRadius: "10px", 
                        fontSize: "9px",
                        fontWeight: 700,
                        ...getPriorityStyle(task.priority)
                      }}>
                        {task.priority} Priority
                      </span>
                      <span>
                        <Clock size={11} /> {new Date(task.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span className={`badge-status ${task.status.toLowerCase().replace(" ", "-")}`}>
                      {task.status}
                    </span>

                    {task.status === "Pending" && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, task.roomNumber, "In Progress")}
                        className="btn btn-outline"
                        style={{ padding: "6px 10px", fontSize: "11px", color: "var(--info)", borderColor: "rgba(6, 182, 212, 0.3)" }}
                        title="Start Task"
                      >
                        <Play size={12} />
                      </button>
                    )}

                    {task.status === "In Progress" && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, task.roomNumber, "Completed")}
                        className="btn btn-outline"
                        style={{ padding: "6px 10px", fontSize: "11px", color: "var(--success)", borderColor: "rgba(16, 185, 129, 0.3)" }}
                        title="Complete Task"
                      >
                        <CheckCircle size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Task Creation Modal Form */}
      {showTaskForm && (
        <div className="modal-overlay">
          <div className="glass-card modal-content" style={{ maxWidth: "480px" }}>
            <button className="modal-close" onClick={() => setShowTaskForm(false)}>
              ×
            </button>
            <h3 style={{ marginBottom: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} className="text-primary" /> Assign Cleaning Order
            </h3>
            
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label className="form-label">Select Room *</label>
                <select
                  value={selectedRoomNumber}
                  onChange={(e) => setSelectedRoomNumber(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">-- Choose Room --</option>
                  {rooms.map(r => (
                    <option key={r.number} value={r.number}>
                      Room {r.number} ({r.type} - {r.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assign Housekeeper *</label>
                <select
                  value={assignedStaffId}
                  onChange={(e) => setAssignedStaffId(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">-- Choose Staff --</option>
                  {staffList
                    .filter(s => s.role === "Housekeeper" || s.role === "Maintenance")
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.role})
                      </option>
                    ))
                  }
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="form-input"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Task Description / Instructions</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Regular floor vacuum, towel refills, and minibar restock..."
                  className="form-input"
                  rows={3}
                  style={{ resize: "none" }}
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowTaskForm(false)} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
