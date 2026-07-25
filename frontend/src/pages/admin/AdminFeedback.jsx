import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => { API.get('/feedback/admin').then(r => setFeedbacks(r.data.feedbacks || [])).catch(() => {}); }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Feedback</h1>
      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No feedback yet</p>
      ) : (
        <div className="space-y-4">
          {feedbacks.map(f => (
            <div key={f._id} className="card p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{f.userId?.fullName}</p>
                  <p className="text-sm text-gray-500">{f.userId?.email}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-lg ${i < f.rating ? 'text-accent-500' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mt-3">{f.review}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(f.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
