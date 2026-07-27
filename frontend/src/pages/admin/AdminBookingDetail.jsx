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
  
  // New state to prevent double-clicking buttons
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = () => {
    API.get(`/bookings/${id}`)
      .then(r => {
        setBooking(r.data.booking);
        // Pre-load existing notes if the admin saved some previously
        if (r.data.booking.adminNotes) {
          setAdminNotes(r.data.booking.adminNotes);
        }
      })
      .catch(() => toast.error('Failed to load booking details'));
  };

  const updateStatus = async (status) => {
    // Add a safety check for destructive actions
    if (['Rejected', 'Cancelled'].includes(status)) {
      if (!window.confirm(`Are you sure you want to mark this booking as ${status}?`)) return;
    }

    setIsProcessing(true);
    try {
      await API.put(`/bookings/${id}/status`, { status, adminNotes });
      toast.success(`Booking ${status.toLowerCase()} successfully`);
      fetchBooking(); // Refresh data
    } catch { 
      toast.error('Failed to update booking status'); 
    } finally {
      setIsProcessing(false);
    }
  };

  const suggestSlot = async () => {
    if (!suggestDate || !suggestTime) return toast.error('Please provide both date and time');
    
    setIsProcessing(true);
    try {
      await API.put(`/bookings/${id}/suggest`, { date: suggestDate, time: suggestTime, adminNotes });
      toast.success('Alternative slot suggested');
      setSuggestDate(''); // Clear inputs after success
      setSuggestTime('');
      fetchBooking();
    } catch { 
      toast.error('Failed to suggest new slot'); 
    } finally {
      setIsProcessing(false);
    }
  };

  if (!booking) return (
    <div className="flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
    </div>
  );

  const statusColor = { 
    Pending: 'bg-yellow-100 text-yellow-700', 
    Confirmed: 'bg-green-100 text-green-700', 
    Rejected: 'bg-red-100 text-red-700', 
    Completed: 'bg-blue-100 text-blue-700', 
    Cancelled: 'bg-gray-100 text-gray-700' 
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Link to="/admin/bookings" className="text-teal-600 text-sm mb-6 inline-block hover:underline">
        &larr; Back to Bookings
      </Link>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-2xl font-bold text-gray-900">
            Booking: {booking.bookingId}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[booking.status]}`}>
            {booking.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Details */}
        <div className="card p-6 bg-white shadow-sm rounded-xl border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-5 border-b pb-2">Client Details</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium text-gray-900">{booking.name}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="font-medium text-gray-900">{booking.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span className="font-medium text-gray-900">{booking.phone}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Age / Gender</span><span className="font-medium text-gray-900">{booking.age || 'N/A'} / {booking.gender || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Profession</span><span className="font-medium text-gray-900">{booking.profession || 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Booking For</span><span className="font-medium text-gray-900">{booking.bookingFor}</span></div>
            <div>
              <span className="text-gray-500">Address</span>
              <p className="font-medium text-gray-900 mt-1 bg-gray-50 p-2 rounded">{booking.address || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="card p-6 bg-white shadow-sm rounded-xl border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-5 border-b pb-2">Appointment Details</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Requested Date</span><span className="font-medium text-gray-900">{booking.preferredDate ? new Date(booking.preferredDate).toLocaleDateString() : 'TBD'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Requested Time</span><span className="font-medium text-gray-900">{booking.preferredTime || 'TBD'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Request Sent On</span><span className="font-medium text-gray-900">{new Date(booking.createdAt).toLocaleDateString()}</span></div>
          </div>
          
          {booking.suggestedSlotStatus === 'suggested' && (
            <div className="mt-6 p-4 bg-orange-50 border border-orange-100 rounded-lg text-sm">
              <p className="font-semibold text-orange-800 mb-1">Waiting on Client for Alternative Slot:</p>
              <p className="text-orange-700">{new Date(booking.suggestedSlot.date).toLocaleDateString()} at {booking.suggestedSlot.time}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Center - Strictly for managing the session */}
      <div className="card p-6 mt-6 bg-white shadow-sm rounded-xl border border-teal-100">
        <h2 className="font-semibold text-gray-900 mb-4">Session Management</h2>
        
        <div className="flex flex-wrap gap-3 mb-6">
          {booking.status === 'Pending' && (
            <>
              <button disabled={isProcessing} onClick={() => updateStatus('Confirmed')} className="px-6 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition">Accept Request</button>
              <button disabled={isProcessing} onClick={() => updateStatus('Rejected')} className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition">Reject</button>
            </>
          )}
          
          {(booking.status === 'Confirmed') && (
            <button disabled={isProcessing} onClick={() => updateStatus('Completed')} className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 transition">Mark as Completed</button>
          )}
          
          {booking.status === 'Pending' && (
            <button disabled={isProcessing} onClick={() => updateStatus('Cancelled')} className="px-6 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition">Cancel</button>
          )}
        </div>

        {/* Suggest Alternative Slot */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="font-medium text-gray-900 mb-3">Suggest Alternative Slot</h3>
          <div className="flex flex-wrap items-center gap-3">
            <input type="date" value={suggestDate} onChange={e => setSuggestDate(e.target.value)} className="input-field w-auto p-2 border rounded" />
            <select value={suggestTime} onChange={e => setSuggestTime(e.target.value)} className="input-field w-auto p-2 border rounded">
              <option value="">Select time</option>
              {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <button disabled={isProcessing} onClick={suggestSlot} className="px-5 py-2.5 bg-orange-100 text-orange-800 rounded-lg text-sm font-medium hover:bg-orange-200 disabled:opacity-50 transition">
              Send Suggestion
            </button>
          </div>
        </div>

        {/* Admin Notes */}
        <div className="mt-6 border-t border-gray-100 pt-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">Internal Admin Notes (Client cannot see this)</label>
          <textarea 
            rows={3} 
            value={adminNotes} 
            onChange={e => setAdminNotes(e.target.value)} 
            className="input-field w-full resize-none p-3 border rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent" 
            placeholder="Add internal notes about this client or session before accepting/rejecting..." 
          />
        </div>
      </div>
    </div>
  );
}