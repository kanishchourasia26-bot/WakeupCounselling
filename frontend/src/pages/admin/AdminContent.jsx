import { useEffect, useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminContent() {
  const [tab, setTab] = useState('site');
  
  // States for Site & CMS
  const [site, setSite] = useState({});
  const [cmsItems, setCmsItems] = useState([]);
  const [editingCms, setEditingCms] = useState(null);
  const [cmsForm, setCmsForm] = useState({ title: '', subtitle: '', body: '' });
  
  // States for Gallery
  const [galleryItems, setGalleryItems] = useState([]);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [galleryForm, setGalleryForm] = useState({ title: '', category: '', description: '' });
  const [galleryFile, setGalleryFile] = useState(null);

  // UX States
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    setIsLoading(true);
    try {
      const [siteRes, cmsRes, galleryRes] = await Promise.all([
        API.get('/content/site-details'),
        API.get('/content/cms'),
        API.get('/content/gallery')
      ]);
      setSite(siteRes.data.site || {});
      setCmsItems(cmsRes.data.items || []);
      setGalleryItems(galleryRes.data.items || []);
    } catch (error) {
      toast.error('Failed to load some site content.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SITE DETAILS HANDLERS ---
  const updateSite = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try { 
      await API.put('/content/site-details', site); 
      toast.success('Site details updated successfully!'); 
    } catch { 
      toast.error('Failed to update site details.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- CMS HANDLERS ---
  const startEditCms = (item) => { 
    setEditingCms(item); 
    setCmsForm({ title: item.title, subtitle: item.subtitle, body: item.body }); 
  };
  
  const saveCms = async () => {
    setIsSubmitting(true);
    try { 
      await API.put(`/content/cms/${editingCms.key}`, cmsForm); 
      toast.success('CMS Page updated successfully!'); 
      setEditingCms(null); 
      
      // Refresh just the CMS items
      const r = await API.get('/content/cms');
      setCmsItems(r.data.items || []);
    } catch { 
      toast.error('Failed to update CMS page.'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- GALLERY HANDLERS ---
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    if (!galleryFile) return toast.error('Please select an image file.');

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('image', galleryFile);
    formData.append('title', galleryForm.title);
    formData.append('category', galleryForm.category);
    formData.append('description', galleryForm.description);

    try {
      // 👇 Galti yahan thi, maine API call theek kar di hai (bina headers ke)
      await API.post('/content/gallery', formData);
      
      toast.success('Image added to gallery!');
      setShowGalleryForm(false);
      setGalleryForm({ title: '', category: '', description: '' });
      setGalleryFile(null);
      
      // Refresh gallery
      const r = await API.get('/content/gallery');
      setGalleryItems(r.data.items || []);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error('Failed to upload image.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      await API.delete(`/content/gallery/${id}`);
      toast.success('Image deleted');
      setGalleryItems(prev => prev.filter(item => item._id !== id));
    } catch {
      toast.error('Failed to delete image');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Site Content Management</h1>
      
      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        {[
          { k: 'site', l: 'Site Details' }, 
          { k: 'cms', l: 'CMS Pages' },
          { k: 'gallery', l: 'Gallery Images' }
        ].map(t => (
          <button 
            key={t.k} 
            onClick={() => setTab(t.k)} 
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition ${tab === t.k ? 'bg-teal-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {/* --- SITE DETAILS TAB --- */}
      {tab === 'site' && (
        <form onSubmit={updateSite} className="card p-6 md:p-8 space-y-5 bg-white shadow-sm rounded-xl border border-gray-100">
          <h2 className="text-lg font-semibold border-b pb-2 mb-4">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
            <input type="text" value={site.title || ''} onChange={e => setSite({...site, title: e.target.value})} className="input-field w-full border rounded p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About Text (Footer/Sidebar)</label>
            <textarea rows={3} value={site.about || ''} onChange={e => setSite({...site, about: e.target.value})} className="input-field w-full border rounded p-2 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Physical Address</label>
            <input type="text" value={site.address || ''} onChange={e => setSite({...site, address: e.target.value})} className="input-field w-full border rounded p-2" />
          </div>
          
          <h2 className="text-lg font-semibold border-b pb-2 mb-4 mt-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="text" value={site.phone || ''} onChange={e => setSite({...site, phone: e.target.value})} className="input-field w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" value={site.email || ''} onChange={e => setSite({...site, email: e.target.value})} className="input-field w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input type="text" value={site.whatsapp || ''} onChange={e => setSite({...site, whatsapp: e.target.value})} className="input-field w-full border rounded p-2" />
            </div>
          </div>
          
          <div className="pt-4">
            <button type="submit" disabled={isSubmitting} className="btn-primary px-6 py-2.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 disabled:bg-gray-400 transition">
              {isSubmitting ? 'Saving...' : 'Save Site Details'}
            </button>
          </div>
        </form>
      )}

      {/* --- CMS PAGES TAB --- */}
      {tab === 'cms' && (
        <div className="space-y-4 max-w-4xl">
          {editingCms ? (
            <div className="card p-6 bg-white shadow-sm rounded-xl border border-teal-100 space-y-4">
              <div className="border-b pb-3 mb-4">
                <h3 className="font-semibold text-lg text-gray-900">Editing Section: <span className="text-teal-600 font-mono text-base">{editingCms.key}</span></h3>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={cmsForm.title} onChange={e => setCmsForm({...cmsForm, title: e.target.value})} className="input-field w-full border rounded p-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input type="text" value={cmsForm.subtitle} onChange={e => setCmsForm({...cmsForm, subtitle: e.target.value})} className="input-field w-full border rounded p-2" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Content</label>
                <textarea rows={8} value={cmsForm.body} onChange={e => setCmsForm({...cmsForm, body: e.target.value})} className="input-field w-full border rounded p-2 resize-none" />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button disabled={isSubmitting} onClick={saveCms} className="btn-primary px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50">
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
                <button disabled={isSubmitting} onClick={() => setEditingCms(null)} className="btn-secondary px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {cmsItems.map(item => (
                <div key={item._id} className="card p-5 flex flex-col sm:flex-row justify-between sm:items-center bg-white shadow-sm rounded-xl border border-gray-100 hover:border-teal-100 transition">
                  <div className="mb-3 sm:mb-0">
                    <p className="text-xs text-teal-600 font-mono font-bold uppercase tracking-wider mb-1">Section: {item.key}</p>
                    <h3 className="font-medium text-gray-900 text-lg">{item.title || '(No title provided)'}</h3>
                  </div>
                  <button onClick={() => startEditCms(item)} className="text-teal-600 bg-teal-50 px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-100 transition whitespace-nowrap">
                    Edit Content
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- GALLERY TAB --- */}
      {tab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Gallery Overview</h2>
            <button onClick={() => setShowGalleryForm(!showGalleryForm)} className="btn-primary bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 transition">
              {showGalleryForm ? 'Close Form' : '+ Add New Image'}
            </button>
          </div>

          {showGalleryForm && (
            <form onSubmit={handleGallerySubmit} className="card p-6 space-y-4 max-w-2xl bg-white shadow-sm border border-teal-100 rounded-xl">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Select Image File <span className="text-red-500">*</span></label>
                <input type="file" accept="image/*" onChange={e => setGalleryFile(e.target.files[0])} className="w-full text-sm p-2 border rounded bg-gray-50" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Image Title <span className="text-red-500">*</span></label>
                <input type="text" value={galleryForm.title} onChange={e => setGalleryForm({...galleryForm, title: e.target.value})} placeholder="e.g., Professional Counseling Session" className="input-field w-full border rounded p-2" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                  <input type="text" value={galleryForm.category} onChange={e => setGalleryForm({...galleryForm, category: e.target.value})} placeholder="e.g., Therapy" className="input-field w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
                  <input type="text" value={galleryForm.description} onChange={e => setGalleryForm({...galleryForm, description: e.target.value})} placeholder="Short description..." className="input-field w-full border rounded p-2" />
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="btn-primary w-full md:w-auto mt-2 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 disabled:opacity-50">
                {isSubmitting ? 'Uploading...' : 'Upload Image'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryItems.map(item => (
              <div key={item._id} className="card overflow-hidden relative group rounded-xl shadow-sm border border-gray-100 bg-white">
                
                {/* 👇 4TH STEP YAHAN KIYA HAI: {`/${item.image}`} hata kar {item.image} kar diya */}
                <div className="h-40 bg-gray-200">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                
                <div className="p-3 bg-white">
                  <p className="font-semibold text-sm text-gray-900 truncate" title={item.title}>{item.title}</p>
                  <p className="text-xs text-teal-600 mt-1 uppercase tracking-wider font-medium">{item.category || 'General'}</p>
                </div>
                <button onClick={() => deleteGalleryItem(item._id)} className="absolute top-2 right-2 bg-red-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm">
                  Delete
                </button>
              </div>
            ))}
            
            {galleryItems.length === 0 && !showGalleryForm && (
              <p className="text-gray-500 text-sm col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                No images in your gallery yet. Click "Add New Image" to get started.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}