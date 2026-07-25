import { useEffect, useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', category: 'General', status: 'draft' });

  useEffect(() => { API.get('/blogs/all').then(r => setBlogs(r.data.blogs || [])).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/blogs', form);
      toast.success('Blog created');
      setShowForm(false); setForm({ title: '', body: '', category: 'General', status: 'draft' });
      API.get('/blogs/all').then(r => setBlogs(r.data.blogs || []));
    } catch { toast.error('Failed'); }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Delete?')) return;
    await API.delete(`/blogs/${id}`);
    toast.success('Deleted');
    API.get('/blogs/all').then(r => setBlogs(r.data.blogs || []));
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Blogs</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">{showForm ? 'Cancel' : 'New Blog'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4">
          <input type="text" placeholder="Title" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input-field" />
          <textarea rows={6} placeholder="Content" required value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="input-field resize-none" />
          <div className="flex gap-4">
            <input type="text" placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input-field" />
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="input-field">
              <option value="draft">Draft</option><option value="published">Published</option>
            </select>
          </div>
          <button type="submit" className="btn-primary text-sm">Create Blog</button>
        </form>
      )}
      <div className="space-y-3">
        {blogs.map(b => (
          <div key={b._id} className="card p-5 flex justify-between items-center">
            <div>
              <h3 className="font-medium text-gray-900">{b.title}</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-xs text-gray-500">{b.category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
              </div>
            </div>
            <button onClick={() => deleteBlog(b._id)} className="text-red-500 text-sm hover:underline">Delete</button>
          </div>
        ))}
        {blogs.length === 0 && <p className="text-gray-500 text-center py-8">No blogs yet</p>}
      </div>
    </div>
  );
}
