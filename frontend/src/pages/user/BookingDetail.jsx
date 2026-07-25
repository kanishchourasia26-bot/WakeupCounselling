import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    API.get(`/bookings/${id}`).then(r => setBooking(r.data.booking)).catch(() => {});
  }, [id]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled');
      navigate('/dashboard/bookings');
    } catch { toast.error('Failed to cancel'); }
  };

  const handleRespond = async (action) => {
    try {
      await API.put(`/bookings/${id}/respond`, { action });
      toast.success(action === 'accept' ? 'Slot accepted' : 'Slot declined');
      API.get(`/bookings/${id}`).then(r => setBooking(r.data.booking));
    } catch { toast.error('Failed to respond'); }
  };

  if (!booking) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700', Completed: 'bg-blue-100 text-blue-700', Cancelled: 'bg-gray-100 text-gray-700', Expired: 'bg-orange-100 text-orange-700' };

  return (
    <div className="max-w-2xl mx-auto sm:mx-0 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/dashboard/bookings"
          className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors duration-150"
        >
          <span aria-hidden="true">&larr;</span> Back
        </Link>
        <h1 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 truncate">Booking Details</h1>
      </div>

      <div className="card p-5 sm:p-8 space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div className="min-w-0">
            <p className="text-sm text-gray-500">Booking ID</p>
            <p className="font-heading font-bold text-lg sm:text-xl text-gray-900 truncate">{booking.bookingId}</p>
          </div>
          <span className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium ${statusColor[booking.status]}`}>
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900 mt-0.5">{booking.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium text-gray-900 mt-0.5">{booking.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900 mt-0.5 truncate">{booking.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Booking For</p>
            <p className="font-medium text-gray-900 mt-0.5">{booking.bookingFor}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preferred Date</p>
            <p className="font-medium text-gray-900 mt-0.5">{booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'TBD'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Preferred Time</p>
            <p className="font-medium text-gray-900 mt-0.5">{booking.preferredTime || 'TBD'}</p>
          </div>
        </div>

        {booking.status === 'Expired' && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="font-medium text-orange-800">This booking has expired because the scheduled date has passed.</p>
            <p className="text-sm text-orange-700 mt-1">Please book a new session if you still need counseling.</p>
          </div>
        )}

        {booking.suggestedSlotStatus === 'suggested' && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="font-medium text-orange-800 mb-2">Admin suggested a new slot:</p>
            <p className="text-sm text-orange-700">
              {new Date(booking.suggestedSlot.date).toLocaleDateString()} at {booking.suggestedSlot.time}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => handleRespond('accept')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors duration-150 active:scale-[0.98]"
              >
                Accept
              </button>
              <button
                onClick={() => handleRespond('decline')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-150 active:scale-[0.98]"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-150"
          >
            Cancel Booking
          </button>
        )}

        {booking.status === 'Completed' && (
          <Link
            to="/dashboard/feedback"
            className="btn-primary text-sm inline-flex items-center transition-transform duration-150 active:scale-[0.98]"
          >
            Give Feedback
          </Link>
        )}
      </div>
    </div>
  );
}