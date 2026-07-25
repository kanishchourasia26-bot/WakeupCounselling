import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [suggestDate, setSuggestDate] = useState('');
  const [suggestTime, setSuggestTime] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    API.get(`/bookings/${id}`).then(r => setBooking(r.data.booking)).catch(() => {});
  }, [id]);

  const updateStatus = async (status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status, adminNotes });
      toast.success(`Booking ${status.toLowerCase()}`);
      API.get(`/bookings/${id}`).then(r => setBooking(r.data.booking));
    } catch { toast.error('Failed to update'); }
  };

  const suggestSlot = async () => {
    if (!suggestDate || !suggestTime) return toast.error('Please provide date and time');
    try {
      await API.put(`/bookings/${id}/suggest`, { date: suggestDate, time: suggestTime });
      toast.success('Slot suggested');
      API.get(`/bookings/${id}`).then(r => setBooking(r.data.booking));
    } catch { toast.error('Failed to suggest'); }
  };

  if (!booking) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  const statusColor = { Pending: 'bg-yellow-100 text-yellow-700', Confirmed: 'bg-green-100 text-green-700', Rejected: 'bg-red-100 text-red-700', Completed: 'bg-blue-100 text-blue-700', Cancelled: 'bg-gray-100 text-gray-700' };

  return (
    <div className="max-w-3xl animate-fade-in">
      <Link to="/admin/bookings" className="text-teal-600 text-sm mb-4 inline-block">&larr; Back to Bookings</Link>
      <div className="flex items-center gap-4 mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">{booking.bookingId}</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[booking.status]}`}>{booking.status}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Client Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{booking.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{booking.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium">{booking.phone}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Age</span><span className="font-medium">{booking.age || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Gender</span><span className="font-medium">{booking.gender || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Profession</span><span className="font-medium">{booking.profession || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Booking For</span><span className="font-medium">{booking.bookingFor}</span></div>
            <div><span className="text-gray-500">Address</span><p className="font-medium mt-1">{booking.address || 'N/A'}</p></div>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Appointment Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Preferred Date</span><span className="font-medium">{booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'TBD'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Preferred Time</span><span className="font-medium">{booking.preferredTime || 'TBD'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Created</span><span className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</span></div>
          </div>
          {booking.suggestedSlotStatus === 'suggested' && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg text-sm">
              <p className="font-medium text-orange-800">Suggested: {new Date(booking.suggestedSlot.date).toLocaleDateString()} at {booking.suggestedSlot.time}</p>
              <p className="text-orange-600 text-xs mt-1">Status: {booking.suggestedSlotStatus}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="card p-6 mt-6">
        <h2 className="font-semibold text-gray-900 mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {booking.status === 'Pending' && (
            <>
              <button onClick={() => updateStatus('Confirmed')} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Accept</button>
              <button onClick={() => updateStatus('Rejected')} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Reject</button>
            </>
          )}
          {(booking.status === 'Confirmed') && (
            <button onClick={() => updateStatus('Completed')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Mark Completed</button>
          )}
          {booking.status === 'Pending' && (
            <button onClick={() => updateStatus('Cancelled')} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">Cancel</button>
          )}
        </div>
        <div className="border-t border-gray-100 pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Suggest Alternative Slot</h3>
          <div className="flex flex-wrap gap-3">
            <input type="date" value={suggestDate} onChange={e => setSuggestDate(e.target.value)} className="input-field w-auto" />
            <select value={suggestTime} onChange={e => setSuggestTime(e.target.value)} className="input-field w-auto">
              <option value="">Select time</option>
              {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={suggestSlot} className="px-4 py-2 bg-accent-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-accent-600">Suggest</button>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
          <textarea rows={2} value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="input-field resize-none" placeholder="Optional notes..." />
        </div>
      </div>
    </div>
  );
}
