import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function About() {
  const [about, setAbout] = useState(null);
  useEffect(() => {
    API.get('/content/cms/about').then(r => setAbout(r.data.item)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="text-teal-200 mt-3">Learn more about Wake Up Counselling</p>
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-6">{about?.title || 'About Wake Up Counselling'}</h2>
            {about?.subtitle && <p className="text-xl text-teal-600 font-medium mb-6">{about.subtitle}</p>}
            <div className="text-gray-600 leading-relaxed whitespace-pre-line space-y-4">
              <p>{about?.body || 'Wake Up Counselling Jabalpur is a premier counseling center dedicated to providing comprehensive mental health services. Our experienced counselor offers a safe, confidential, and supportive environment for individuals seeking professional guidance.'}</p>
              <p>We believe in the power of counseling to transform lives. Whether you are dealing with anxiety, depression, relationship issues, career confusion, or simply want to understand yourself better, we are here to help.</p>
              <p>Our approach is client-centered, evidence-based, and tailored to meet your unique needs. We use proven therapeutic techniques to help you develop coping strategies, build resilience, and lead a more fulfilling life.</p>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Safe Space', desc: 'A confidential and non-judgmental environment for healing' },
              { title: 'Evidence-Based', desc: 'Proven therapeutic approaches tailored to your needs' },
              { title: 'Client-Centered', desc: 'Your goals and well-being are our top priority' }
            ].map((item, i) => (
              <div key={i} className="card p-6 text-center">
                <h3 className="font-heading font-semibold text-lg text-teal-600 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
