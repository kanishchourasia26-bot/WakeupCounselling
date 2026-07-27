import { useEffect, useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

// 1. Extract initial state to avoid repeating code
const INITIAL_FORM_STATE = { title: '', body: '', category: 'General', status: 'draft' };

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  
  // 2. Added states for Editing and Loading
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const r = await API.get('/blogs/all');
      setBlogs(r.data.blogs || []);
    } catch {
      toast.error('Failed to load blogs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button while submitting

    try {
      if (editingId) {
        // Handle Edit Update
        await API.put(`/blogs/${editingId}`, form);
        toast.success('Blog updated successfully');
        // Update local state without refetching everything
        setBlogs(prev => prev.map(b => b._id === editingId ? { ...b, ...form } : b));
      } else {
        // Handle Create
        const res = await API.post('/blogs', form);
        toast.success('Blog created successfully');
        // Fetch to ensure we get the newly created ID from the database
        fetchBlogs(); 
      }
      resetForm();
    } catch {
      toast.error(editingId ? 'Failed to update blog' : 'Failed to create blog');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (blog) => {
    setForm({ title: blog.title, body: blog.body, category: blog.category, status: blog.status });
    setEditingId(blog._id);
    setShowForm(true);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    // 3. Added proper error handling to delete
    try {
      await API.delete(`/blogs/${id}`);
      toast.success('Blog deleted');
      // 4. Performance boost: Remove from UI instantly without re-fetching all blogs
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch {
      toast.error('Failed to delete blog');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setForm(INITIAL_FORM_STATE);
    setEditingId(null);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-900">Blogs</h1>
        <button 
          onClick={showForm ? resetForm : () => setShowForm(true)} 
          className="btn-primary text-sm bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
        >
          {showForm ? 'Cancel' : 'New Blog'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-6 space-y-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-semibold text-lg mb-2">{editingId ? 'Edit Blog' : 'Create New Blog'}</h2>
          
          <input 
            type="text" 
            placeholder="Blog Title" 
            required 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
            className="input-field w-full p-2 border rounded" 
          />
          
          <textarea 
            rows={8} 
            placeholder="Write your content here..." 
            required 
            value={form.body} 
            onChange={e => setForm({...form, body: e.target.value})} 
            className="input-field resize-none w-full p-2 border rounded" 
          />
          
          <div className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Category (e.g., Therapy, Wellness)" 
              value={form.category} 
              onChange={e => setForm({...form, category: e.target.value})} 
              className="input-field w-full p-2 border rounded" 
            />
            <select 
              value={form.status} 
              onChange={e => setForm({...form, status: e.target.value})} 
              className="input-field w-full p-2 border rounded bg-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`btn-primary text-sm px-6 py-2 rounded-lg text-white transition ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {isSubmitting ? 'Saving...' : (editingId ? 'Update Blog' : 'Create Blog')}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {blogs.map(b => (
          <div key={b._id} className="card p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white rounded-xl shadow-sm border border-gray-100 gap-4">
            <div>
              <h3 className="font-medium text-gray-900">{b.title}</h3>
              <div className="flex gap-2 mt-2">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{b.category}</span>
                <span className={`text-xs px-2 py-1 rounded font-medium ${b.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleEdit(b)} 
                className="text-teal-600 text-sm font-medium hover:underline"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteBlog(b._id)} 
                className="text-red-500 text-sm font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {blogs.length === 0 && <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-xl border border-dashed">No blogs have been written yet.</p>}
      </div>
    </div>
  );
}