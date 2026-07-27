import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUserDetail() {
  const { id } = useParams(); // User's ID from URL
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Client Data States
  const [client, setClient] = useState(null);
  const [notes, setNotes] = useState('');
  const [bookings, setBookings] = useState([]);
  const [tests, setTests] = useState([]);
  const [resources, setResources] = useState([]);

  // New Resource Form State
  const [newResource, setNewResource] = useState({ title: '', link: '', description: '' });

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      // 👇 YAHAN /auth ADD KIYA HAI 👇
      const res = await API.get(`/auth/admin/users/${id}/details`);
      
      setClient(res.data.user);
      setNotes(res.data.user.counselorNotes || '');
      setBookings(res.data.bookings || []);
      setTests(res.data.tests || []);
      setResources(res.data.resources || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load client details.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- ACTIONS ---

  const saveNotes = async () => {
    setIsSaving(true);
    try {
      // 👇 YAHAN /auth ADD KIYA HAI 👇
      await API.put(`/auth/admin/users/${id}/notes`, { notes });
      toast.success('Counselor notes saved!');
    } catch {
      toast.error('Failed to save notes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddResource = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 👇 YAHAN /auth ADD KIYA HAI 👇
      await API.post(`/auth/admin/users/${id}/resources`, newResource);
      toast.success('Resource sent to client!');
      setNewResource({ title: '', link: '', description: '' });
      fetchClientData(); // Refresh list
    } catch {
      toast.error('Failed to add resource.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteResource = async (resourceId) => {
    if (!window.confirm('Delete this resource? The client will no longer see it.')) return;
    try {
      // 👇 YAHAN /auth ADD KIYA HAI 👇
      await API.delete(`/auth/admin/users/${id}/resources/${resourceId}`);
      toast.success('Resource removed.');
      setResources(prev => prev.filter(r => r._id !== resourceId));
    } catch {
      toast.error('Failed to remove resource.');
    }
  };

  const deleteUser = async () => {
    if (!window.confirm('CRITICAL WARNING: Are you sure you want to permanently delete this user and all their data?')) return;
    try {
      // 👇 YAHAN /auth ADD KIYA HAI 👇
      await API.delete(`/auth/admin/users/${id}`);
      toast.success('User deleted successfully.');
      navigate('/admin/users'); // Go back to user list
    } catch {
      toast.error('Failed to delete user.');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div></div>;
  if (!client) return <div className="text-center py-20">Client not found.</div>;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/admin/users" className="text-teal-600 text-sm hover:underline mb-2 inline-block">&larr; Back to all users</Link>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Client: {client.fullName}</h1>
          <p className="text-sm text-gray-500">{client.email} | {client.phone || 'No phone'}</p>
        </div>
        <button onClick={deleteUser} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition">
          Delete Client
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'overview', label: 'Profile & Notes' },
          { id: 'sessions', label: `Sessions (${bookings.length})` },
          { id: 'tests', label: `Tests (${tests.length})` },
          { id: 'resources', label: `Assigned Resources (${resources.length})` }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-t-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB: OVERVIEW & NOTES --- */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="card p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
              <h2 className="font-semibold text-gray-900 mb-4 border-b pb-2">Profile Details</h2>
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-500 block text-xs">Joined On</span><span className="font-medium">{new Date(client.createdAt).toLocaleDateString()}</span></div>
                <div><span className="text-gray-500 block text-xs">Age</span><span className="font-medium">{client.age || 'N/A'}</span></div>
                <div><span className="text-gray-500 block text-xs">Gender</span><span className="font-medium">{client.gender || 'N/A'}</span></div>
                <div><span className="text-gray-500 block text-xs">Profession</span><span className="font-medium">{client.occupation || 'N/A'}</span></div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="card p-6 bg-white border border-teal-100 shadow-sm rounded-xl">
              <h2 className="font-semibold text-gray-900 mb-2">Private Counselor Notes</h2>
              <p className="text-xs text-gray-500 mb-4">These notes are strictly private. The client cannot see them.</p>
              <textarea 
                rows={10} 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="w-full p-4 border border-gray-200 rounded-lg bg-yellow-50/30 focus:ring-2 focus:ring-teal-500 outline-none resize-y"
                placeholder="Write clinical notes, observations, or session summaries here..."
              />
              <button disabled={isSaving} onClick={saveNotes} className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
                {isSaving ? 'Saving...' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB: SESSIONS --- */}
      {activeTab === 'sessions' && (
        <div className="card bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Booking History</h2>
          {bookings.length === 0 ? <p className="text-gray-500 text-sm">No sessions booked yet.</p> : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{b.preferredDate ? new Date(b.preferredDate).toLocaleDateString() : 'Date TBD'}</p>
                    <p className="text-xs text-gray-500 mt-1">For: {b.bookingFor}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 bg-gray-200 rounded-full text-xs font-semibold">{b.status}</span>
                    <Link to={`/admin/bookings/${b._id}`} className="text-teal-600 text-sm hover:underline">Manage</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- TAB: RESOURCES --- */}
      {activeTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Send Resource Form */}
          <div className="card p-6 bg-white border border-teal-100 shadow-sm rounded-xl">
            <h2 className="font-semibold text-gray-900 mb-4">Assign New Resource</h2>
            <form onSubmit={handleAddResource} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Resource Title *</label>
                <input type="text" required value={newResource.title} onChange={e => setNewResource({...newResource, title: e.target.value})} className="w-full p-2 border rounded text-sm" placeholder="e.g., Anxiety Management PDF" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Link / URL *</label>
                <input type="url" required value={newResource.link} onChange={e => setNewResource({...newResource, link: e.target.value})} className="w-full p-2 border rounded text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message / Description</label>
                <textarea rows={2} value={newResource.description} onChange={e => setNewResource({...newResource, description: e.target.value})} className="w-full p-2 border rounded text-sm resize-none" placeholder="Read this before our next session..." />
              </div>
              <button type="submit" disabled={isSaving} className="w-full py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 disabled:opacity-50">
                Send to Client
              </button>
            </form>
          </div>

          {/* List of Assigned Resources */}
          <div className="card p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h2 className="font-semibold text-gray-900 mb-4">Assigned to this Client</h2>
            {resources.length === 0 ? <p className="text-gray-500 text-sm">No resources assigned yet.</p> : (
              <div className="space-y-3">
                {resources.map(r => (
                  <div key={r._id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 relative group">
                    <h3 className="font-medium text-sm text-gray-900">{r.title}</h3>
                    {r.description && <p className="text-xs text-gray-500 mt-1">{r.description}</p>}
                    <a href={r.link} target="_blank" rel="noreferrer" className="text-teal-600 text-xs mt-2 inline-block hover:underline">View Resource &rarr;</a>
                    <button onClick={() => deleteResource(r._id)} className="absolute top-3 right-3 text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:underline">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB: TESTS (Placeholder) --- */}
      {activeTab === 'tests' && (
        <div className="card bg-white border border-gray-100 shadow-sm rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Psychological Tests Taken</h2>
          {tests.length === 0 ? <p className="text-gray-500 text-sm">Client hasn't taken any tests yet.</p> : (
             <div className="space-y-3">
               {/* Map your tests here similar to bookings */}
             </div>
          )}
        </div>
      )}

    </div>
  );
}