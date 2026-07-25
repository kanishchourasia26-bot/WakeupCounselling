import { useEffect, useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminSlots() {
  const [slots, setSlots] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [newHoliday, setNewHoliday] = useState('');
  const [holidayReason, setHolidayReason] = useState('');
  const defaultSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
  const [selectedSlots, setSelectedSlots] = useState(defaultSlots);

  useEffect(() => {
    loadSlots(); loadHolidays();
  }, []);

  const loadSlots = () => {
    const start = new Date().toISOString().split('T')[0];
    const end = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0];
    API.get(`/slots?startDate=${start}&endDate=${end}`).then(r => setSlots(r.data.slots || [])).catch(() => {});
  };
  const loadHolidays = () => { API.get('/slots/holidays').then(r => setHolidays(r.data.holidays || [])).catch(() => {}); };

  const createSlot = async () => {
    if (!newDate) return toast.error('Select a date');
    try {
      await API.post('/slots', { date: newDate, timeSlots: selectedSlots.map(t => ({ time: t, isBooked: false })) });
      toast.success('Slot created');
      loadSlots(); setNewDate('');
    } catch { toast.error('Failed'); }
  };

  const deleteSlot = async (id) => {
    if (!confirm('Delete this slot?')) return;
    await API.delete(`/slots/${id}`);
    toast.success('Deleted'); loadSlots();
  };

  const addHoliday = async () => {
    if (!newHoliday) return toast.error('Select a date');
    try {
      await API.post('/slots/holidays', { date: newHoliday, reason: holidayReason });
      toast.success('Holiday added'); loadHolidays(); setNewHoliday(''); setHolidayReason('');
    } catch { toast.error('Failed'); }
  };

  const deleteHoliday = async (id) => {
    await API.delete(`/slots/holidays/${id}`);
    toast.success('Removed'); loadHolidays();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900">Manage Slots & Holidays</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Add Available Slot</h2>
          <div className="space-y-4">
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} className="input-field" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
              <div className="flex flex-wrap gap-2">
                {defaultSlots.map(t => (
                  <button key={t} type="button" onClick={() => setSelectedSlots(prev => prev.includes(t) ? prev.filter(s => s !== t) : [...prev, t])}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${selectedSlots.includes(t) ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={createSlot} className="btn-primary text-sm">Add Slot</button>
          </div>
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-3">Upcoming Slots</h3>
            {slots.length === 0 ? <p className="text-gray-500 text-sm">No slots configured</p> : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {slots.map(s => (
                  <div key={s._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-sm">
                    <span>{new Date(s.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className="text-gray-500">{s.timeSlots?.length || 0} slots</span>
                    <button onClick={() => deleteSlot(s._id)} className="text-red-500 text-xs hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Block Holidays</h2>
          <div className="space-y-4">
            <input type="date" value={newHoliday} onChange={e => setNewHoliday(e.target.value)} className="input-field" />
            <input type="text" value={holidayReason} onChange={e => setHolidayReason(e.target.value)} placeholder="Reason (optional)" className="input-field" />
            <button onClick={addHoliday} className="btn-primary text-sm">Add Holiday</button>
          </div>
          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-3">Blocked Dates</h3>
            {holidays.length === 0 ? <p className="text-gray-500 text-sm">No holidays blocked</p> : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {holidays.map(h => (
                  <div key={h._id} className="flex justify-between items-center p-3 bg-red-50 rounded-lg text-sm">
                    <span>{new Date(h.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className="text-gray-500 text-xs">{h.reason || 'No reason'}</span>
                    <button onClick={() => deleteHoliday(h._id)} className="text-red-500 text-xs hover:underline">Remove</button>
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
