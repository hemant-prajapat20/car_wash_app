
// Realistic dummy data for Car Wash Management Platform

// --- SHARED DATA ---

export const notifications = [
  { id: 1, type: 'Booking', title: 'New Booking Request', message: 'Alex Johnson requested a Premium Detail at 09:00 AM', time: '5 mins ago', unread: true },
  { id: 2, type: 'Payment', title: 'Payment Received', message: '$99 received from Sarah Williams', time: '1 hour ago', unread: true },
  { id: 3, type: 'Complaint', title: 'New Complaint', message: 'Wait time complaint from Anna Bell', time: '2 hours ago', unread: false },
  { id: 4, type: 'System', title: 'Software Update', message: 'System maintenance scheduled for tonight at 12:00 AM', time: '5 hours ago', unread: false },
  { id: 5, type: 'Offer', title: 'Flash Sale! 50% Off', message: 'Get 50% off on Ceramic Coating this weekend.', time: '1 day ago', unread: true },
];

// --- VENDOR DASHBOARD DATA ---

export const dashboardStats = {
  totalBookings: 1248,
  pendingBookings: 12,
  completedBookings: 1184,
  totalRevenue: 45280,
  revenueGrowth: 18.5,
  monthlyEarnings: [2400, 3200, 2800, 4100, 3800, 4500, 4200, 4800, 5200, 4900, 5600, 6100],
  bookingAnalytics: [120, 150, 140, 180, 210, 190, 240],
  customerStats: {
    new: 85,
    returning: 320,
    satisfaction: 98.2
  },
  topPackages: [
    { name: 'Premium Detail', bookings: 450, revenue: 22500 },
    { name: 'Standard Wash', bookings: 380, revenue: 11400 },
    { name: 'Express Shine', bookings: 250, revenue: 5000 },
    { name: 'Interior Deep Clean', bookings: 168, revenue: 6380 }
  ]
};

export const bookings = [
  { id: 'BK-001', customer: 'Alex Johnson', vehicle: 'Tesla Model 3', package: 'Premium Detail', date: '2024-05-07', time: '09:00 AM', payment: 'Paid', status: 'In Progress' },
  { id: 'BK-002', customer: 'Sarah Williams', vehicle: 'BMW X5', package: 'Interior Deep Clean', date: '2024-05-07', time: '10:30 AM', payment: 'Paid', status: 'Pending' },
  { id: 'BK-003', customer: 'Michael Chen', vehicle: 'Honda Civic', package: 'Express Shine', date: '2024-05-07', time: '11:00 AM', payment: 'Pending', status: 'Pending' },
  { id: 'BK-004', customer: 'Emily Davis', vehicle: 'Audi A4', package: 'Standard Wash', date: '2024-05-06', time: '02:00 PM', payment: 'Paid', status: 'Completed' },
  { id: 'BK-005', customer: 'David Miller', vehicle: 'Ford F-150', package: 'Premium Detail', date: '2024-05-06', time: '03:30 PM', payment: 'Paid', status: 'Completed' },
  { id: 'BK-006', customer: 'Jessica Brown', vehicle: 'Toyota RAV4', package: 'Standard Wash', date: '2024-05-06', time: '04:00 PM', payment: 'Paid', status: 'Completed' },
];

export const slots = [
  { time: '08:00 AM', status: 'Booked', type: 'Normal' },
  { time: '09:00 AM', status: 'Booked', type: 'Normal' },
  { time: '10:00 AM', status: 'Available', type: 'Normal' },
  { time: '11:00 AM', status: 'Booked', type: 'Peak' },
  { time: '12:00 PM', status: 'Available', type: 'Peak' },
  { time: '01:00 PM', status: 'Booked', type: 'Peak' },
  { time: '02:00 PM', status: 'Available', type: 'Normal' },
  { time: '03:00 PM', status: 'Booked', type: 'Normal' },
];

export const staff = [
  { id: 'ST-01', name: 'Robert Fox', role: 'Main Detailer', rating: 4.9, services: 450, status: 'Active', attendance: 98 },
  { id: 'ST-02', name: 'Jane Cooper', role: 'Washer', rating: 4.7, services: 320, status: 'Active', attendance: 95 },
  { id: 'ST-03', name: 'Cody Fisher', role: 'Interior Expert', rating: 4.8, services: 280, status: 'Inactive', attendance: 88 },
  { id: 'ST-04', name: 'Esther Howard', role: 'Polishing Specialist', rating: 5.0, services: 190, status: 'Active', attendance: 100 },
];

export const packages = [
  { id: 'PK-01', name: 'Express Shine', price: 20, features: ['Exterior Wash', 'Tire Dressing', 'Window Cleaning'], duration: '30 mins' },
  { id: 'PK-02', name: 'Standard Wash', price: 45, features: ['Express Shine +', 'Interior Vacuum', 'Dashboard Dusting'], duration: '1 hour', popular: true },
  { id: 'PK-03', name: 'Premium Detail', price: 99, features: ['Standard Wash +', 'Waxing', 'Engine Bay Cleaning', 'Odor Removal'], duration: '2.5 hours', popular: true },
  { id: 'PK-04', name: 'Ceramic Pro', price: 249, features: ['Premium Detail +', 'Ceramic Coating', 'Paint Correction'], duration: '6 hours' },
];

export const customers = [
  { id: 'CU-01', name: 'Alex Johnson', email: 'alex@example.com', bookings: 12, points: 1200, lastVisit: '2024-05-07' },
  { id: 'CU-02', name: 'Sarah Williams', email: 'sarah@example.com', bookings: 8, points: 850, lastVisit: '2024-05-07' },
  { id: 'CU-03', name: 'Michael Chen', email: 'mike@example.com', bookings: 5, points: 400, lastVisit: '2024-05-06' },
  { id: 'CU-04', name: 'Emily Davis', email: 'emily@example.com', bookings: 15, points: 1800, lastVisit: '2024-05-05' },
];

// --- CUSTOMER DASHBOARD DATA ---

export const customerStats = {
  totalPoints: 1450,
  activeSubscription: 'Premium Member',
  savingsThisYear: 240,
  upcomingBookingsCount: 2,
  completedBookingsCount: 15,
};

export const myVehicles = [
  { id: 'V-01', name: 'Tesla Model 3', plate: 'NY-TESLA-1', type: 'Sedan', image: 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=200&h=120&fit=crop' },
  { id: 'V-02', name: 'BMW X5', plate: 'BMW-X5-2024', type: 'SUV', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=200&h=120&fit=crop' },
];

export const myAddresses = [
  { id: 'AD-01', label: 'Home', address: '123 Wall Street, Manhattan, NY 10005', type: 'Residence' },
  { id: 'AD-02', label: 'Office', address: '500 5th Ave, New York, NY 10110', type: 'Work' },
];

export const vendors = [
  {
    id: 'VN-001',
    name: 'AquaWash Pro',
    rating: 4.8,
    reviews: 1250,
    distance: '1.2 km',
    priceRange: '$$',
    status: 'Open',
    responseTime: '15 mins',
    satisfaction: 98,
    completedServices: 4500,
    tags: ['Popular', 'Top Rated', 'Fast Service'],
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop',
    workingHours: '08:00 AM - 08:00 PM',
    pickup: true,
    location: 'Downtown, NY',
    offers: ['20% Off First Booking', 'Festival Special: Free Wax'],
    gallery: [
      'https://images.unsplash.com/photo-1552930294-6b595f4c2974?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1601362840469-51e4d8d59085?w=200&h=200&fit=crop'
    ]
  },
  {
    id: 'VN-002',
    name: 'Elite Shine Center',
    rating: 4.9,
    reviews: 890,
    distance: '3.5 km',
    priceRange: '$$$',
    status: 'Open',
    responseTime: '10 mins',
    satisfaction: 99,
    completedServices: 2800,
    tags: ['Premium', 'Best Offers'],
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&h=400&fit=crop',
    workingHours: '09:00 AM - 09:00 PM',
    pickup: true,
    location: 'Midtown, NY',
    offers: ['Buy 3 Get 1 Free', 'Member Discount: 15%'],
    gallery: [
      'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?w=200&h=200&fit=crop'
    ]
  },
  {
    id: 'VN-003',
    name: 'Express Clean Hub',
    rating: 4.5,
    reviews: 2100,
    distance: '0.8 km',
    priceRange: '$',
    status: 'Closed',
    responseTime: '5 mins',
    satisfaction: 94,
    completedServices: 6200,
    tags: ['Fast Service', 'Nearest'],
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop',
    workingHours: '07:00 AM - 07:00 PM',
    pickup: false,
    location: 'Uptown, NY',
    offers: ['Daily Happy Hour: 30% Off'],
    gallery: []
  },
];

export const myBookings = [
  {
    id: 'CB-101',
    vendor: 'AquaWash Pro',
    vehicle: 'Tesla Model 3',
    package: 'Premium Detail',
    date: 'May 10, 2024',
    time: '10:00 AM',
    status: 'Upcoming',
    price: 99,
    payment: 'Pending',
    pickup: 'Yes',
  },
  {
    id: 'CB-102',
    vendor: 'Elite Shine Center',
    vehicle: 'BMW X5',
    package: 'Ceramic Pro',
    date: 'May 12, 2024',
    time: '02:00 PM',
    status: 'Upcoming',
    price: 249,
    payment: 'Paid',
    pickup: 'No',
  },
  {
    id: 'CB-103',
    vendor: 'AquaWash Pro',
    vehicle: 'Tesla Model 3',
    package: 'Standard Wash',
    date: 'April 28, 2024',
    time: '09:00 AM',
    status: 'Completed',
    price: 45,
    payment: 'Paid',
    pickup: 'No',
  },
];

export const promoOffers = [
  { id: 'OFF-1', title: 'First Booking Discount', desc: 'Get 20% off on your very first service with us.', code: 'FIRST20', color: 'bg-blue-600' },
  { id: 'OFF-2', title: 'Festival Mega Sale', desc: 'Flat $50 off on all full detailing packages.', code: 'FEST50', color: 'bg-purple-600' },
  { id: 'OFF-3', title: 'Membership Perks', desc: 'Members get free tire dressing and vacuuming on every wash.', code: 'MEMBERFREE', color: 'bg-amber-600' },
  { id: 'OFF-4', title: 'Referral Reward', desc: 'Refer a friend and both get $15 credit in your wallet.', code: 'REF15', color: 'bg-emerald-600' },
];

export const complaints = [
  { id: 'CP-01', customer: 'Tom Hardy', type: 'Service Quality', priority: 'High', status: 'Resolved', date: '2024-05-02' },
  { id: 'CP-02', customer: 'Anna Bell', type: 'Wait Time', priority: 'Medium', status: 'In Progress', date: '2024-05-05' },
  { id: 'CP-03', customer: 'Chris Rock', type: 'Staff Behavior', priority: 'Low', status: 'Pending', date: '2024-05-07' },
];
