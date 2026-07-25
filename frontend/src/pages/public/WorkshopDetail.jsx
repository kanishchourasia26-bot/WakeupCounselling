import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';

export default function WorkshopDetail() {
  const { slug } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [related, setRelated] = useState([]);
  useEffect(() => {
    API.get(`/content/workshops/${slug}`).then(r => { setWorkshop(r.data.workshop); setRelated(r.data.related || []); }).catch(() => {});
  }, [slug]);

  if (!workshop) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">{workshop.title}</h1>
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {workshop.image && <img src={`/${workshop.image}`} alt={workshop.title} className="w-full rounded-2xl mb-8 max-h-96 object-cover" />}
          <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: workshop.body }} />
          <div className="mt-10">
            <Link to="/contact" className="btn-primary">Enquire About This Workshop</Link>
          </div>
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-8">Related Workshops</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((w) => (
                  <Link key={w._id} to={`/workshops/${w.slug}`} className="card p-4 hover:shadow-lg transition">
                    <h3 className="font-medium text-gray-900 hover:text-teal-600 transition">{w.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
