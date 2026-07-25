import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  useEffect(() => {
    API.get(`/content/events/${slug}`).then(r => setEvent(r.data.event)).catch(() => {});
  }, [slug]);

  if (!event) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-3xl md:text-4xl font-bold">{event.title}</h1>
          {event.date && <p className="text-teal-200 mt-3">{event.date}</p>}
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {event.image && <img src={`/${event.image}`} alt={event.title} className="w-full rounded-2xl mb-8 max-h-96 object-cover" />}
          <div className="prose prose-lg max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: event.body }} />
          <div className="mt-10">
            <Link to="/contact" className="btn-primary">Book Appointment</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
