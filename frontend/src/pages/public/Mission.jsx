import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function Mission() {
  const [mission, setMission] = useState(null);
  const [vision, setVision] = useState(null);
  useEffect(() => {
    API.get('/content/cms/mission').then(r => setMission(r.data.item)).catch(() => {});
    API.get('/content/cms/vision').then(r => setVision(r.data.item)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Mission & Vision</h1>
          <p className="text-teal-200 mt-3">Our purpose and direction</p>
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="card p-10 border-l-4 border-l-teal-500">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-teal-600 font-medium text-sm uppercase tracking-wider mb-2">Our Mission</h3>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">{mission?.title || 'Providing accessible mental health services'}</h2>
              <p className="text-gray-600 leading-relaxed">{mission?.body || 'We are committed to breaking the stigma around mental health and making professional counseling accessible to everyone.'}</p>
            </div>
            <div className="card p-10 border-l-4 border-l-accent-500">
              <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🔭</span>
              </div>
              <h3 className="text-accent-600 font-medium text-sm uppercase tracking-wider mb-2">Our Vision</h3>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">{vision?.title || 'Leading counseling center in Central India'}</h2>
              <p className="text-gray-600 leading-relaxed">{vision?.body || 'We envision a society where mental health is prioritized, stigma is eliminated, and every individual has access to support.'}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
