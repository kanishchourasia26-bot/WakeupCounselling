import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  useEffect(() => {
    API.get('/content/workshops').then(r => setWorkshops(r.data.workshops || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Workshops</h1>
          <p className="text-teal-200 mt-3">Our workshops and programs</p>
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {workshops.length === 0 ? (
            <p className="text-center text-gray-500">No workshops listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workshops.map((w) => (
                <Link key={w._id} to={`/workshops/${w.slug}`} className="card group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center overflow-hidden">
                    {w.image ? <img src={`/${w.image}`} alt={w.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> :
                    <span className="text-6xl text-teal-300">📚</span>}
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-teal-600 transition">{w.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{w.body?.replace(/<[^>]+>/g, '')}</p>
                    {w.isFeatured && <span className="inline-block mt-3 px-3 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">Featured</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
