import { useEffect, useState } from 'react';
import API from '../../services/api';
import { FaTimes, FaEye } from 'react-icons/fa';

export default function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    API.get('/content/gallery')
      .then(r => setGallery(r.data.items || []))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Our Gallery</h1>
          <p className="text-teal-200 mt-3">Years in pictures and moments of care</p>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {gallery.length === 0 ? (
            <p className="text-center text-gray-500 py-12">No gallery images yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((item) => (
                <div 
                  key={item._id} 
                  className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer bg-white shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => setLightbox(item)}
                >
                  {/* FIX 1: Removed / from src */}
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{item.title}</h3>
                        {item.category && (
                          <span className="text-xs text-teal-300 uppercase tracking-wider">{item.category}</span>
                        )}
                      </div>
                      <span className="bg-teal-600 p-2.5 rounded-full text-white shadow-md">
                        <FaEye size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightbox && (
        <div 
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm" 
          onClick={() => setLightbox(null)}
        >
          <div 
            className="relative bg-white rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal box
          >
            {/* Close Button */}
            <button 
              onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 z-10 bg-gray-900/70 text-white p-2.5 rounded-full hover:bg-gray-900 transition"
            >
              <FaTimes size={16} />
            </button>

            {/* Image Preview */}
            <div className="max-h-[60vh] bg-gray-950 flex items-center justify-center overflow-hidden">
              {/* FIX 2: Removed / from src */}
              <img 
                src={lightbox.image} 
                alt={lightbox.title} 
                className="w-full h-full object-contain max-h-[60vh]" 
              />
            </div>

            {/* Content Info */}
            <div className="p-6 bg-white">
              {lightbox.category && (
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest">
                  {lightbox.category}
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900 mt-1 mb-2">
                {lightbox.title}
              </h2>
              {lightbox.description && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {lightbox.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}