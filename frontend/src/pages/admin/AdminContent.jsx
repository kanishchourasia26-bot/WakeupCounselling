import { useEffect, useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminContent() {
  const [tab, setTab] = useState('site');
  const [site, setSite] = useState({});
  const [cmsItems, setCmsItems] = useState([]);
  const [editingCms, setEditingCms] = useState(null);
  const [cmsForm, setCmsForm] = useState({ title: '', subtitle: '', body: '' });

  useEffect(() => {
    API.get('/content/site-details').then(r => setSite(r.data.site || {})).catch(() => {});
    API.get('/content/cms').then(r => setCmsItems(r.data.items || [])).catch(() => {});
  }, []);

  const updateSite = async (e) => {
    e.preventDefault();
    try { await API.put('/content/site-details', site); toast.success('Updated'); } catch { toast.error('Failed'); }
  };

  const startEditCms = (item) => { setEditingCms(item); setCmsForm({ title: item.title, subtitle: item.subtitle, body: item.body }); };
  const saveCms = async () => {
    try { await API.put(`/content/cms/${editingCms.key}`, cmsForm); toast.success('Updated'); setEditingCms(null); API.get('/content/cms').then(r => setCmsItems(r.data.items || [])); } catch { toast.error('Failed'); }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Site Content</h1>
      <div className="flex gap-2 mb-6">
        {[{ k: 'site', l: 'Site Details' }, { k: 'cms', l: 'CMS Pages' }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.k ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{t.l}</button>
        ))}
      </div>
      {tab === 'site' && (
        <form onSubmit={updateSite} className="card p-6 space-y-4 max-w-2xl">
          <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={site.title || ''} onChange={e => setSite({...site, title: e.target.value})} className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1">About</label><textarea rows={3} value={site.about || ''} onChange={e => setSite({...site, about: e.target.value})} className="input-field resize-none" /></div>
          <div><label className="block text-sm font-medium mb-1">Address</label><input type="text" value={site.address || ''} onChange={e => setSite({...site, address: e.target.value})} className="input-field" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" value={site.phone || ''} onChange={e => setSite({...site, phone: e.target.value})} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={site.email || ''} onChange={e => setSite({...site, email: e.target.value})} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">WhatsApp</label><input type="text" value={site.whatsapp || ''} onChange={e => setSite({...site, whatsapp: e.target.value})} className="input-field" /></div>
          <button type="submit" className="btn-primary text-sm">Save Site Details</button>
        </form>
      )}
      {tab === 'cms' && (
        <div className="space-y-3">
          {editingCms ? (
            <div className="card p-6 space-y-4">
              <h3 className="font-semibold">Editing: {editingCms.key}</h3>
              <input type="text" value={cmsForm.title} onChange={e => setCmsForm({...cmsForm, title: e.target.value})} placeholder="Title" className="input-field" />
              <input type="text" value={cmsForm.subtitle} onChange={e => setCmsForm({...cmsForm, subtitle: e.target.value})} placeholder="Subtitle" className="input-field" />
              <textarea rows={5} value={cmsForm.body} onChange={e => setCmsForm({...cmsForm, body: e.target.value})} placeholder="Body" className="input-field resize-none" />
              <div className="flex gap-2">
                <button onClick={saveCms} className="btn-primary text-sm">Save</button>
                <button onClick={() => setEditingCms(null)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </div>
          ) : (
            cmsItems.map(item => (
              <div key={item._id} className="card p-5 flex justify-between items-center">
                <div>
                  <p className="text-xs text-teal-600 font-mono">{item.key}</p>
                  <h3 className="font-medium text-gray-900 mt-1">{item.title || '(No title)'}</h3>
                </div>
                <button onClick={() => startEditCms(item)} className="text-teal-600 text-sm hover:underline">Edit</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
