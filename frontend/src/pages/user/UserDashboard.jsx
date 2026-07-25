import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { FiCalendar, FiFileText, FiBell, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

export default function UserDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    API.get('/bookings/my').then(r => setBookings(r.data.bookings || [])).catch(() => {});
    API.get('/notifications').then(r => setNotifications(r.data.notifications || [])).catch(() => {});
    API.get('/tests/results/my').then(r => setTestResults(r.data.results || [])).catch(() => {});
  }, []);

  const statusColor = { Pending: 'text-yellow-600 bg-yellow-50', Confirmed: 'text-green-600 bg-green-50', Rejected: 'text-red-600 bg-red-50', Completed: 'text-blue-600 bg-blue-50', Cancelled: 'text-gray-600 bg-gray-50', Expired: 'text-orange-600 bg-orange-50' };
  const statusIcon = { Pending: FiClock, Confirmed: FiCheckCircle, Rejected: FiXCircle, Completed: FiCheckCircle, Cancelled: FiXCircle, Expired: FiXCircle };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 sm:p-8 text-white">
        <h1 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
          Welcome back, {user?.fullName?.split(' ')[0]}!
        </h1>
        <p className="text-teal-100 mt-2 text-sm sm:text-base">Here's your dashboard overview</p>
        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            to="/dashboard/bookings/new"
            className="bg-white text-teal-700 font-medium px-5 py-2 rounded-lg text-sm hover:bg-teal-50 transition-colors duration-150 active:scale-[0.98]"
          >
            Book Session
          </Link>
          <Link
            to="/dashboard/tests"
            className="bg-teal-500 text-white font-medium px-5 py-2 rounded-lg text-sm hover:bg-teal-400 transition-colors duration-150 active:scale-[0.98]"
          >
            Take a Test
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: FiCalendar, color: 'text-blue-600 bg-blue-50' },
          { label: 'Upcoming', value: bookings.filter(b => b.status === 'Confirmed' || b.status === 'Pending').length, icon: FiClock, color: 'text-green-600 bg-green-50' },
          { label: 'Tests Taken', value: testResults.length, icon: FiFileText, color: 'text-purple-600 bg-purple-50' },
          { label: 'Unread Notifications', value: notifications.filter(n => !n.isRead).length, icon: FiBell, color: 'text-orange-600 bg-orange-50' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-2xl font-bold text-gray-900 leading-tight">{stat.value}</p>
                <p className="text-sm text-gray-500 truncate">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center gap-3">
          <h2 className="font-heading font-semibold text-lg">Recent Bookings</h2>
          <Link
            to="/dashboard/bookings"
            className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors duration-150 shrink-0"
          >
            View All
          </Link>
        </div>
        <div className="p-5 sm:p-6">
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No bookings yet.{' '}
              <Link to="/dashboard/bookings/new" className="text-teal-600 underline hover:text-teal-700 transition-colors duration-150">
                Book your first session
              </Link>
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((b) => {
                const SIcon = statusIcon[b.status] || FiClock;
                return (
                  <Link
                    key={b._id}
                    to={`/dashboard/bookings/${b._id}`}
                    className="flex items-center justify-between gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <SIcon size={20} className="text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{b.bookingId}</p>
                        <p className="text-sm text-gray-500">{b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : 'Date TBD'}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${statusColor[b.status]}`}>
                      {b.status}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Test Results & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center gap-3">
            <h2 className="font-heading font-semibold text-lg">Test Results</h2>
            <Link
              to="/dashboard/tests"
              className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors duration-150 shrink-0"
            >
              View All
            </Link>
          </div>
          <div className="p-5 sm:p-6">
            {testResults.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tests taken yet</p>
            ) : (
              <div className="space-y-3">
                {testResults.slice(0, 3).map((r) => (
                  <Link
                    key={r._id}
                    to={`/dashboard/tests/result/${r._id}`}
                    className="flex justify-between items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-gray-900 truncate">{r.testId?.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-medium text-teal-600 shrink-0">{r.result}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center gap-3">
            <h2 className="font-heading font-semibold text-lg">Notifications</h2>
            <Link
              to="/dashboard/notifications"
              className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors duration-150 shrink-0"
            >
              View All
            </Link>
          </div>
          <div className="p-5 sm:p-6">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    className={`p-3 rounded-lg ${n.isRead ? 'bg-gray-50' : 'bg-teal-50 border border-teal-100'}`}
                  >
                    <p className="text-sm font-medium text-gray-900">{n.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}