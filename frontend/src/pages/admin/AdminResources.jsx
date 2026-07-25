import { useEffect, useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminResources() {
  const [resources, setResources] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'article', url: '', category: 'General', status: 'draft' });

  useEffect(() => { API.get('/resources').then(r => setResources(r.data.resources || [])).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/resources', form);
      toast.success('Resource created');
      setShowForm(false); setForm({ title: '', description: '', type: 'article', url: '', category: 'General', status: 'draft' });
      API.get('/resources').then(r => setResources(r.data.resources || [])).catch(() => {});
    } catch { toast.error('Failed'); }
  };

  const deleteResource = async (id) => {
    if (!confirm('Delete?')) return;
    await API.delete(`/resources/${id}`);
    toast.success('Deleted');
    API.get('/resources').then(r => setResources(r.data.resources || [])).catch(() => {});
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Resources</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">{showForm ? 'Cancel' : 'Add Resource'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4">
          <input type="text" placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" />
          <textarea rows={3} placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field resize-none" />
          <div className="grid grid-cols-2 gap-4">
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="input-field">
              <option value="article">Article</option><option value="pdf">PDF</option><option value="video">Video</option>
            </select>
            <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" />
          </div>
          <input type="url" placeholder="URL (for articles/videos)" value={form.url} onChange={e => setForm({...form, url: e.target.value})} className="input-field" />
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field">
            <option value="draft">Draft</option><option value="published">Published</option>
          </select>
          <button type="submit" className="btn-primary text-sm">Create</button>
        </form>
      )}
      <div className="space-y-3">
        {resources.map(r => (
          <div key={r._id} className="card p-5 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900">{r.title}</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full">{r.type}</span>
                <span className="text-xs text-gray-500">{r.category}</span>
              </div>
            </div>
            <button onClick={() => deleteResource(r._id)} className="text-red-500 text-sm hover:underline">Delete</button>
          </div>
        ))}
        {resources.length === 0 && <p className="text-gray-500 text-center py-8">No resources yet</p>}
      </div>
    </div>
  );
}
