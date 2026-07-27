import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    API.get('/bookings/my').then(r => setBookings(r.data.bookings || [])).catch(() => {});
  }, []);

  const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700', Completed: 'bg-blue-100 text-blue-700', Cancelled: 'bg-gray-100 text-gray-700', Expired: 'bg-orange-100 text-orange-700' };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900">My Bookings</h1>
        <Link
          to="/dashboard/bookings/new"
          className="btn-primary text-sm transition-transform duration-150 active:scale-[0.98]"
        >
          New Booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="card p-8 sm:p-12 text-center">
          <p className="text-gray-500 mb-4">No bookings yet</p>
          <Link
            to="/dashboard/bookings/new"
            className="btn-primary text-sm inline-flex items-center transition-transform duration-150 active:scale-[0.98]"
          >
            Book Your First Session
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Link
              key={b._id}
              to={`/dashboard/bookings/${b._id}`}
              className="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md hover:border-gray-200 transition-shadow duration-150"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{b.bookingId}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : 'Date TBD'}
                  {b.preferredTime && ` at ${b.preferredTime}`}
                </p>
                {b.suggestedSlotStatus === 'suggested' && (
                  <p className="text-xs text-orange-600 mt-1.5 font-medium">New slot suggested — action required</p>
                )}
              </div>
              <span className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium ${statusColor[b.status]}`}>
                {b.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}