export const INITIAL_ROOMS = [
  { number: 101, type: "Standard", price: 1200, status: "Available", amenities: ["Wi-Fi", "TV", "AC"] },
  { number: 102, type: "Standard", price: 1200, status: "Occupied", amenities: ["Wi-Fi", "TV", "AC"] },
  { number: 103, type: "Standard", price: 1200, status: "Cleaning", amenities: ["Wi-Fi", "TV"] },
  { number: 104, type: "Standard", price: 1200, status: "Available", amenities: ["Wi-Fi", "TV", "AC"] },
  
  { number: 201, type: "Deluxe", price: 2500, status: "Available", amenities: ["Wi-Fi", "Smart TV", "AC", "Mini Fridge"] },
  { number: 202, type: "Deluxe", price: 2500, status: "Occupied", amenities: ["Wi-Fi", "Smart TV", "AC", "Mini Fridge", "Balcony"] },
  { number: 203, type: "Deluxe", price: 2500, status: "Maintenance", amenities: ["Wi-Fi", "Smart TV", "AC", "Mini Fridge"] },
  { number: 204, type: "Deluxe", price: 2500, status: "Available", amenities: ["Wi-Fi", "Smart TV", "AC", "Mini Fridge", "Balcony"] },
  
  { number: 301, type: "Executive", price: 4500, status: "Occupied", amenities: ["Wi-Fi", "Smart TV", "AC", "Mini Bar", "Bathtub", "Office Desk"] },
  { number: 302, type: "Executive", price: 4500, status: "Available", amenities: ["Wi-Fi", "Smart TV", "AC", "Mini Bar", "Bathtub", "Office Desk"] },
  { number: 303, type: "Executive", price: 4500, status: "Cleaning", amenities: ["Wi-Fi", "Smart TV", "AC", "Mini Bar", "Bathtub"] },
  { number: 304, type: "Executive", price: 4500, status: "Available", amenities: ["Wi-Fi", "Smart TV", "AC", "Mini Bar", "Bathtub", "Office Desk", "Balcony"] },
  
  { number: 401, type: "Presidential Suite", price: 8500, status: "Available", amenities: ["Ultra High-Speed Wi-Fi", "75\" 8K TV", "Central AC", "Full Mini Bar", "Jacuzzi", "Kitchenette", "Living Room", "24/7 Butler Service"] },
  { number: 402, type: "Presidential Suite", price: 8500, status: "Occupied", amenities: ["Ultra High-Speed Wi-Fi", "75\" 8K TV", "Central AC", "Full Mini Bar", "Jacuzzi", "Kitchenette", "Living Room", "24/7 Butler Service"] }
];

export const INITIAL_STAFF = [
  { id: "STF-01", name: "Ramesh Kumar", role: "Manager", status: "Active", phone: "+91 98765 43210" },
  { id: "STF-02", name: "Anjali Sharma", role: "Receptionist", status: "Active", phone: "+91 87654 32109" },
  { id: "STF-03", name: "Sunil Verma", role: "Housekeeper", status: "Active", phone: "+91 76543 21098" },
  { id: "STF-04", name: "Pooja Mishra", role: "Housekeeper", status: "Active", phone: "+91 65432 10987" },
  { id: "STF-05", name: "Vikram Singh", role: "Maintenance", status: "Active", phone: "+91 54321 09876" }
];

export const SERVICES_CATALOG = [
  { id: "SRV-DIN", name: "Fine Dining Restaurant", category: "Dining", price: 450, icon: "Utensils" },
  { id: "SRV-SPA", name: "Ayurvedic Spa & Wellness", category: "Spa", price: 1500, icon: "Sparkles" },
  { id: "SRV-LND", name: "Express Laundry & Dry Clean", category: "Laundry", price: 250, icon: "Shirt" },
  { id: "SRV-CAB", name: "Airport Pick-up / Drop Cab", category: "Transport", price: 800, icon: "Car" },
  { id: "SRV-BAR", name: "Mini-Bar Refill", category: "Dining", price: 600, icon: "Wine" },
  { id: "SRV-RMS", name: "24/7 Room Service Charge", category: "Service", price: 150, icon: "Bell" }
];

export const INITIAL_BOOKINGS = [
  {
    id: "BKG-1001",
    roomNumber: 102,
    guestName: "Arjun Mehta",
    guestPhone: "+91 99887 76655",
    guestEmail: "arjun.mehta@gmail.com",
    guestIdProof: "Aadhar: 4522-8903-1254",
    checkInDate: "2026-05-22",
    checkOutDate: "2026-05-25",
    discount: 200,
    servicesBilled: [
      { id: "SRV-DIN", name: "Fine Dining Restaurant", price: 450, date: "2026-05-22T21:00:00Z" },
      { id: "SRV-RMS", name: "24/7 Room Service Charge", price: 150, date: "2026-05-23T08:30:00Z" }
    ],
    status: "Active",
    billingStatus: "Pending",
    totalDays: 3,
    roomCharge: 3600, // 3 * 1200
    grandTotal: 4000 // 3600 + 450 + 150 - 200
  },
  {
    id: "BKG-1002",
    roomNumber: 202,
    guestName: "Neha Sen",
    guestPhone: "+91 88776 65544",
    guestEmail: "neha.sen@yahoo.com",
    guestIdProof: "Passport: Z5693021",
    checkInDate: "2026-05-23",
    checkOutDate: "2026-05-28",
    discount: 500,
    servicesBilled: [
      { id: "SRV-SPA", name: "Ayurvedic Spa & Wellness", price: 1500, date: "2026-05-23T16:00:00Z" }
    ],
    status: "Active",
    billingStatus: "Pending",
    totalDays: 5,
    roomCharge: 12500, // 5 * 2500
    grandTotal: 13500 // 12500 + 1500 - 500
  },
  {
    id: "BKG-1003",
    roomNumber: 301,
    guestName: "Rajesh Kulkarni",
    guestPhone: "+91 77665 54433",
    guestEmail: "rajesh.k@rediffmail.com",
    guestIdProof: "Pan Card: AQZPK8912P",
    checkInDate: "2026-05-20",
    checkOutDate: "2026-05-24",
    discount: 1000,
    servicesBilled: [
      { id: "SRV-CAB", name: "Airport Pick-up / Drop Cab", price: 800, date: "2026-05-20T11:00:00Z" },
      { id: "SRV-LND", name: "Express Laundry & Dry Clean", price: 250, date: "2026-05-22T09:00:00Z" },
      { id: "SRV-DIN", name: "Fine Dining Restaurant", price: 900, date: "2026-05-22T20:30:00Z" }
    ],
    status: "Active",
    billingStatus: "Pending",
    totalDays: 4,
    roomCharge: 18000, // 4 * 4500
    grandTotal: 18950 // 18000 + 800 + 250 + 900 - 1000
  },
  {
    id: "BKG-1004",
    roomNumber: 402,
    guestName: "Aditya & Priya Birla",
    guestPhone: "+91 91234 56789",
    guestEmail: "aditya.birla@birla-ent.com",
    guestIdProof: "Aadhar: 9012-4567-8910",
    checkInDate: "2026-05-24",
    checkOutDate: "2026-05-26",
    discount: 1500,
    servicesBilled: [
      { id: "SRV-DIN", name: "Fine Dining Restaurant", price: 1800, date: "2026-05-24T19:30:00Z" },
      { id: "SRV-BAR", name: "Mini-Bar Refill", price: 600, date: "2026-05-24T20:00:00Z" }
    ],
    status: "Active",
    billingStatus: "Pending",
    totalDays: 2,
    roomCharge: 17000, // 2 * 8500
    grandTotal: 17900 // 17000 + 1800 + 600 - 1500
  }
];

export const INITIAL_TASKS = [
  { id: "TSK-01", roomNumber: 103, assignedStaff: "Sunil Verma", priority: "High", status: "In Progress", date: "2026-05-24T18:30:00Z" },
  { id: "TSK-02", roomNumber: 303, assignedStaff: "Pooja Mishra", priority: "Medium", status: "Pending", date: "2026-05-24T19:00:00Z" },
  { id: "TSK-03", roomNumber: 203, assignedStaff: "Vikram Singh", priority: "High", status: "Pending", date: "2026-05-24T19:15:00Z", note: "AC unit fan replacement required" }
];
