import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  useEffect(() => {
    API.get('/content/gallery').then(r => setGallery(r.data.items || [])).catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Our Gallery</h1>
          <p className="text-teal-200 mt-3">Years in pictures</p>
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4">
          {gallery.length === 0 ? (
            <p className="text-center text-gray-500">No gallery images yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item._id} className="aspect-square rounded-xl overflow-hidden cursor-pointer group" onClick={() => setLightbox(item)}>
                  <img src={`/${item.image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={`/${lightbox.image}`} alt={lightbox.title} className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
