import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { FiUsers, FiCalendar, FiCheckCircle, FiClock, FiMessageSquare, FiStar } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    API.get('/content/dashboard/stats').then(r => { setStats(r.data.stats); setRecentBookings(r.data.recentBookings || []); }).catch(() => {});
  }, []);

  if (!stats) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'bg-blue-500' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: FiCalendar, color: 'bg-green-500' },
    { label: 'Pending', value: stats.pendingBookings, icon: FiClock, color: 'bg-yellow-500' },
    { label: 'Completed', value: stats.completedBookings, icon: FiCheckCircle, color: 'bg-teal-500' },
    { label: 'Contacts', value: stats.totalContacts, icon: FiMessageSquare, color: 'bg-purple-500' },
    { label: 'Avg Rating', value: stats.avgRating, icon: FiStar, color: 'bg-accent-500' }
  ];

  const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700', Completed: 'bg-blue-100 text-blue-700', Cancelled: 'bg-gray-100 text-gray-700' };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="card p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${c.color} rounded-xl flex items-center justify-center text-white`}><Icon size={22} /></div>
              <div><p className="text-2xl font-bold text-gray-900">{c.value}</p><p className="text-sm text-gray-500">{c.label}</p></div>
            </div>
          );
        })}
      </div>
      <div className="card">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-heading font-semibold text-lg">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-teal-600 text-sm font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.bookingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : 'TBD'}</td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span></td>
                  <td className="px-6 py-4"><Link to={`/admin/bookings/${b._id}`} className="text-teal-600 text-sm hover:underline">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
