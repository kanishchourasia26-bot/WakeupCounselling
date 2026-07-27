import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';

// 1. Moved static data outside the component to optimize rendering
const STATUS_COLORS = { 
  Pending: 'bg-yellow-100 text-yellow-700', 
  Confirmed: 'bg-green-100 text-green-700', 
  Rejected: 'bg-red-100 text-red-700', 
  Completed: 'bg-blue-100 text-blue-700', 
  Cancelled: 'bg-gray-100 text-gray-700' 
};

const FILTERS = ['', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');
  
  // 2. Added new states for better UX
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsLoading(true);
    const url = filter ? `/bookings?status=${filter}` : '/bookings';
    
    API.get(url)
      .then(r => setBookings(r.data.bookings || []))
      .catch(() => toast.error('Failed to fetch bookings. Please try again.')) // 3. Added error handling
      .finally(() => setIsLoading(false)); // Turn off loading whether it succeeds or fails
  }, [filter]);

  // 4. Smart Search: Filter locally by Name, Phone, or ID
  const displayedBookings = bookings.filter(b => 
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone?.includes(searchTerm) ||
    b.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="font-heading text-2xl font-bold text-gray-900">All Bookings</h1>
        
        {/* New Search Bar */}
        <div className="w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search name, phone, or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
        {FILTERS.map((s) => (
          <button 
            key={s} 
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === s ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            {s || 'All Bookings'}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="card overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking ID</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Name</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              // Loading Skeleton/Spinner state
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading bookings...</p>
                </td>
              </tr>
            ) : displayedBookings.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center">
                  <p className="text-gray-500 text-sm">
                    {searchTerm ? `No bookings found matching "${searchTerm}"` : 'No bookings found for this category.'}
                  </p>
                </td>
              </tr>
            ) : (
              // Data Rows
              displayedBookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{b.bookingId}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'TBD'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${STATUS_COLORS[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link 
                      to={`/admin/bookings/${b._id}`} 
                      className="text-teal-600 text-sm font-medium hover:text-teal-800 hover:underline bg-teal-50 px-3 py-1.5 rounded-lg transition"
                    >
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
  );
}