import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function NewBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.fullName || '', email: user?.email || '', phone: user?.phone || '',
    age: '', gender: user?.gender || '', address: user?.address || '',
    profession: '', bookingFor: 'Self', preferredDate: '', preferredTime: ''
  });
  const [slots, setSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = new Date().toISOString().split('T')[0];
    const end = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];
    API.get(`/slots?startDate=${start}&endDate=${end}`).then(r => setSlots(r.data.slots || [])).catch(() => {});
    API.get('/slots/holidays').then(r => setHolidays(r.data.holidays || [])).catch(() => {});
  }, []);

  const holidayDates = holidays.map(h => new Date(h.date).toISOString().split('T')[0]);
  const availableTimes = slots.find(s => new Date(s.date).toISOString().split('T')[0] === form.preferredDate)?.timeSlots?.filter(t => !t.isBooked) || [];

  const defaultSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/bookings', form);
      toast.success('Booking request submitted successfully!');
      navigate('/dashboard/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Book a Session</h1>
      <form onSubmit={handleSubmit} className="card p-8 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Email *</label><input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Age</label><input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="input-field">
              <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Profession</label><input type="text" value={form.profession} onChange={e => setForm({...form, profession: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Booking For</label>
            <select value={form.bookingFor} onChange={e => setForm({...form, bookingFor: e.target.value})} className="input-field">
              <option value="Self">Self</option><option value="Others">Others</option>
            </select>
          </div>
        </div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Address</label><textarea rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field resize-none" /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
            <input type="date" min={new Date().toISOString().split('T')[0]} value={form.preferredDate} onChange={e => setForm({...form, preferredDate: e.target.value})} className="input-field" />
            {form.preferredDate && holidayDates.includes(form.preferredDate) && <p className="text-red-500 text-xs mt-1">This date is a holiday</p>}
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
            <select value={form.preferredTime} onChange={e => setForm({...form, preferredTime: e.target.value})} className="input-field">
              <option value="">Select time</option>
              {(availableTimes.length > 0 ? availableTimes.map(t => t.time) : defaultSlots).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Submitting...' : 'Submit Booking Request'}</button>
      </form>
    </div>
  );
}
