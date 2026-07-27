import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function UserResources() {
  const [resources, setResources] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [assignedResources, setAssignedResources] = useState([]); // 👈 Naya state for personal resources
  
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('all');

  useEffect(() => {
    // 1. General resources fetch
    API.get('/resources').then(r => setResources(r.data.resources || [])).catch(() => {});
    
    // 2. Bookmarks fetch
    API.get('/resources/bookmarks').then(r => setBookmarks(r.data.resources || [])).catch(() => {});
    
    // 3. 👈 Personal Assigned Resources fetch (from User profile)
    API.get('/auth/me')
      .then(r => {
        // Assume API returns user object directly or inside data.user
        const userData = r.data.user || r.data; 
        setAssignedResources(userData.resources || []);
      })
      .catch(() => {});
  }, []);

  const toggleBookmark = async (id) => {
    await API.put(`/resources/${id}/bookmark`);
    API.get('/resources').then(r => setResources(r.data.resources || [])).catch(() => {});
    API.get('/resources/bookmarks').then(r => setBookmarks(r.data.resources || [])).catch(() => {});
  };

  // 👈 Smart Filtering logic for all tabs
  let activeData = [];
  if (tab === 'bookmarks') activeData = bookmarks;
  else if (tab === 'assigned') activeData = assignedResources; // Counselor wale resources
  else if (tab === 'all') activeData = resources;
  else activeData = resources.filter(r => r.type === tab); // article, pdf, video

  const filtered = activeData.filter(r =>
    r.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Resources</h1>
      
      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { id: 'all', label: 'All Library' },
          { id: 'assigned', label: 'Assigned to Me 🌟' }, // 👈 Naya Tab Add kiya
          { id: 'article', label: 'Articles' },
          { id: 'pdf', label: 'PDFs' },
          { id: 'video', label: 'Videos' },
          { id: 'bookmarks', label: 'Bookmarks' }
        ].map((t) => (
          <button 
            key={t.id} 
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${tab === t.id ? 'bg-teal-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Search resources..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition mb-6" 
      />
      
      {/* Cards Display */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500">
            {tab === 'assigned' ? 'Your counselor has not assigned any personal resources yet.' : 'No resources found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <div key={r._id} className="card p-5 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tab === 'assigned' ? 'bg-yellow-100 text-yellow-800' : 'bg-teal-50 text-teal-600'}`}>
                    {tab === 'assigned' ? 'From Counselor' : (r.type || 'Resource')}
                  </span>
                  <h3 className="font-medium text-gray-900 mt-3 text-lg">{r.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{r.description}</p>
                </div>
                
                {/* Sirf Library resources pe bookmark dikhayenge, Counselor walo pe nahi */}
                {tab !== 'assigned' && (
                  <button onClick={() => toggleBookmark(r._id)} className={`text-2xl transition ${bookmarks.some(b => b._id === r._id) ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200 hover:text-gray-300'}`}>
                    {bookmarks.some(b => b._id === r._id) ? '★' : '☆'}
                  </button>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-50">
                {/* Handles Library URLs */}
                {r.url && <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm font-medium hover:underline inline-flex items-center gap-1">Open Resource &rarr;</a>}
                
                {/* Handles Library Files */}
                {r.file && <a href={`/${r.file}`} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm font-medium hover:underline inline-flex items-center gap-1">Download &rarr;</a>}
                
                {/* 👈 Handles Counselor Assigned Links (Jo schema me 'link' naam se the) */}
                {r.link && <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-teal-600 text-sm font-medium hover:underline inline-flex items-center gap-1">View Assigned Resource &rarr;</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}