import { useEffect, useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function UserFeedback() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/bookings/my').then(r => setBookings((r.data.bookings || []).filter(b => b.status === 'Completed'))).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return toast.error('Please select a booking');
    setLoading(true);
    try {
      await API.post('/feedback', { bookingId: selectedBooking, rating, review });
      toast.success('Feedback submitted! Thank you.');
      setReview('');
      setSelectedBooking('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Give Feedback</h1>
      {bookings.length === 0 ? (
        <div className="card p-8 text-center"><p className="text-gray-500">No completed sessions to review yet</p></div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Session</label>
            <select value={selectedBooking} onChange={e => setSelectedBooking(e.target.value)} className="input-field" required>
              <option value="">Choose a completed session</option>
              {bookings.map(b => <option key={b._id} value={b._id}>{b.bookingId} - {b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : 'N/A'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} type="button" onClick={() => setRating(n)}
                  className={`w-12 h-12 rounded-xl text-xl font-bold transition ${n <= rating ? 'bg-accent-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
            <textarea rows={4} required value={review} onChange={e => setReview(e.target.value)} className="input-field resize-none" placeholder="Share your experience..." />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Submitting...' : 'Submit Feedback'}</button>
        </form>
      )}
    </div>
  );
}
