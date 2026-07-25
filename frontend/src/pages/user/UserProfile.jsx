import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function UserProfile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.fullName || '', phone: user?.phone || '', gender: user?.gender || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
    address: user?.address || '', occupation: user?.occupation || '', emergencyContact: user?.emergencyContact || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put('/auth/profile', form);
      updateUser(data.user);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-2xl font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-heading font-semibold text-lg">{user?.fullName}</p>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})} className="input-field">
              <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input type="date" value={form.dateOfBirth} onChange={e => setForm({...form, dateOfBirth: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
            <input type="text" value={form.occupation} onChange={e => setForm({...form, occupation: e.target.value})} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
            <input type="tel" value={form.emergencyContact} onChange={e => setForm({...form, emergencyContact: e.target.value})} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <textarea rows={3} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-field resize-none" />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
}
