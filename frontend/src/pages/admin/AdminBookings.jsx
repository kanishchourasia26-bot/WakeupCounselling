import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const url = filter ? `/bookings?status=${filter}` : '/bookings';
    API.get(url).then(r => setBookings(r.data.bookings || [])).catch(() => {});
  }, [filter]);

  const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700', Completed: 'bg-blue-100 text-blue-700', Cancelled: 'bg-gray-100 text-gray-700' };

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">All Bookings</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {['', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === s ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((b) => (
              <tr key={b._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.bookingId}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{b.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{b.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : 'TBD'}</td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[b.status]}`}>{b.status}</span></td>
                <td className="px-6 py-4"><Link to={`/admin/bookings/${b._id}`} className="text-teal-600 text-sm hover:underline">Details</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="text-center py-8 text-gray-500">No bookings found</p>}
      </div>
    </div>
  );
}
