import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    API.get('/content/events').then(r => setEvents(r.data.events || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Events</h1>
          <p className="text-teal-200 mt-3">Upcoming and past events</p>
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {events.length === 0 ? (
            <p className="text-center text-gray-500">No events listed yet.</p>
          ) : (
            <div className="space-y-6">
              {events.map((e) => (
                <div key={e._id} className="card p-6 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition">
                  <div className="sm:w-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                    {e.image ? <img src={`/${e.image}`} alt={e.title} className="w-full h-full object-cover" /> :
                    <div className="w-full h-full flex items-center justify-center text-4xl">📅</div>}
                  </div>
                  <div>
                    {e.date && <span className="text-xs text-teal-600 font-medium">{e.date}</span>}
                    <h3 className="font-heading font-semibold text-xl mt-1 mb-2">{e.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{e.body?.replace(/<[^>]+>/g, '')}</p>
                    <Link to={`/services/${e.slug}`} className="inline-flex items-center gap-1 text-teal-600 text-sm font-medium mt-3 hover:text-teal-700">Read More →</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
