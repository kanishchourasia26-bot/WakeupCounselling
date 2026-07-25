import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function UserResources() {
  const [resources, setResources] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  useEffect(() => {
    API.get('/resources').then(r => setResources(r.data.resources || [])).catch(() => {});
    API.get('/resources/bookmarks').then(r => setBookmarks(r.data.resources || [])).catch(() => {});
  }, []);

  const toggleBookmark = async (id) => {
    await API.put(`/resources/${id}/bookmark`);
    API.get('/resources').then(r => setResources(r.data.resources || [])).catch(() => {});
    API.get('/resources/bookmarks').then(r => setBookmarks(r.data.resources || [])).catch(() => {});
  };

  const filtered = (tab === 'bookmarks' ? bookmarks : resources).filter(r =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Resources</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        {['all', 'article', 'pdf', 'video', 'bookmarks'].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <input type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} className="input-field mb-6" />
      {filtered.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No resources found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{r.type}</span>
                  <h3 className="font-medium text-gray-900 mt-2">{r.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{r.description}</p>
                </div>
                <button onClick={() => toggleBookmark(r._id)} className={`text-xl ${bookmarks.some(b => b._id === r._id) ? 'text-accent-500' : 'text-gray-300'}`}>
                  {bookmarks.some(b => b._id === r._id) ? '★' : '☆'}
                </button>
              </div>
              {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm mt-3 inline-block hover:underline">Open Resource →</a>}
              {r.file && <a href={`/${r.file}`} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm mt-3 inline-block hover:underline">Download →</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
