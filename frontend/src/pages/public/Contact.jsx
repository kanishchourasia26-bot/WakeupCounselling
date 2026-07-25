import { useState } from 'react';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contacts', form);
      toast.success('Message sent successfully! We will contact you within 24 hours.');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="bg-gradient-to-r from-teal-800 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="text-teal-200 mt-3">Get in touch with us</p>
        </div>
      </div>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-8">Feel free to contact us and we will reach you within 24 hours.</p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiLocationMarker className="text-teal-600" size={22} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600 text-sm">Jabalpur, Madhya Pradesh, India</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiPhone className="text-teal-600" size={22} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Phone</h3>
                    <p className="text-gray-600 text-sm">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <HiMail className="text-teal-600" size={22} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600 text-sm">info@wakeupcounseling.com</p>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="card p-8 space-y-4">
              <input type="text" placeholder="Your name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input type="email" placeholder="Your email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" />
                <input type="text" placeholder="Your phone" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field" />
              </div>
              <input type="text" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input-field" />
              <textarea rows={5} placeholder="Your message" required value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="input-field resize-none" />
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Message'}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
