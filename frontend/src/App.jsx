import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Mission from './pages/public/Mission';
import Contact from './pages/public/Contact';
import Services from './pages/public/Services';
import ServiceDetail from './pages/public/ServiceDetail';
import Workshops from './pages/public/Workshops';
import WorkshopDetail from './pages/public/WorkshopDetail';
import Gallery from './pages/public/Gallery';
import Events from './pages/public/Events';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import UserBookings from './pages/user/UserBookings';
import NewBooking from './pages/user/NewBooking';
import BookingDetail from './pages/user/BookingDetail';
import UserTests from './pages/user/UserTests';
import TakeTest from './pages/user/TakeTest';
import TestResult from './pages/user/TestResult';
import UserNotifications from './pages/user/UserNotifications';
import UserResources from './pages/user/UserResources';
import UserFeedback from './pages/user/UserFeedback';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminBookingDetail from './pages/admin/AdminBookingDetail';
import AdminSlots from './pages/admin/AdminSlots';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminResources from './pages/admin/AdminResources';
import AdminContent from './pages/admin/AdminContent';
import AdminFeedback from './pages/admin/AdminFeedback';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/workshops" element={<Workshops />} />
        <Route path="/workshops/:slug" element={<WorkshopDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/events" element={<Events />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<UserDashboard />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="bookings" element={<UserBookings />} />
        <Route path="bookings/new" element={<NewBooking />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        <Route path="tests" element={<UserTests />} />
        <Route path="tests/:id" element={<TakeTest />} />
        <Route path="tests/result/:id" element={<TestResult />} />
        <Route path="notifications" element={<UserNotifications />} />
        <Route path="resources" element={<UserResources />} />
        <Route path="feedback" element={<UserFeedback />} />
      </Route>
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="bookings/:id" element={<AdminBookingDetail />} />
        <Route path="slots" element={<AdminSlots />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="feedback" element={<AdminFeedback />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
