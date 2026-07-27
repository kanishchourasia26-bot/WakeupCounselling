import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast'; // Added for error notifications
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiMessageSquare, FiStar } from 'react-icons/fi';

// 1. Move static object outside the component to prevent unnecessary re-renders
const STATUS_COLORS = { 
  Pending: 'bg-yellow-100 text-yellow-700', 
  Confirmed: 'bg-green-100 text-green-700', 
  Rejected: 'bg-red-100 text-red-700', 
  Completed: 'bg-blue-100 text-blue-700', 
  Cancelled: 'bg-gray-100 text-gray-700' 
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  
  // 2. Proper loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    API.get('/content/dashboard/stats')
      .then(r => { 
        setStats(r.data.stats || {}); 
        setRecentBookings(r.data.recentBookings || []); 
      })
      .catch(() => {
        toast.error('Failed to load dashboard data.');
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-gray-500">Failed to load dashboard data. Please try refreshing the page.</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-teal-600 hover:underline">
          Refresh Page
        </button>
      </div>
    );
  }

  // 3. Added safe fallbacks (|| 0) to prevent undefined/NaN errors
  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Total Bookings', value: stats?.totalBookings || 0, icon: FiCalendar, color: 'bg-green-500' },
    { label: 'Pending', value: stats?.pendingBookings || 0, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Completed', value: stats?.completedBookings || 0, icon: FiCheckCircle, color: 'bg-teal-500' },
    { label: 'Contacts', value: stats?.totalContacts || 0, icon: FiMessageSquare, color: 'bg-purple-500' },
    { label: 'Avg Rating', value: stats?.avgRating || 0, icon: FiStar, color: 'bg-teal-600' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="card p-5 flex items-center gap-4 bg-white shadow-sm border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 md:w-14 md:h-14 ${c.color} rounded-xl flex items-center justify-center text-white shadow-sm`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold text-gray-900">{c.value}</p>
                <p className="text-sm font-medium text-gray-500">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table */}
      <div className="card bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="font-heading font-semibold text-lg text-gray-900">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-teal-600 text-sm font-medium hover:text-teal-800 hover:underline transition">
            View All &rarr;
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500 text-sm">
                    No recent bookings found.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{b.bookingId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin/bookings/${b._id}`} className="text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-100 transition">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}