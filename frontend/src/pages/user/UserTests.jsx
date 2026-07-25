import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

export default function UserTests() {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  useEffect(() => {
    API.get('/tests').then(r => setTests(r.data.tests || [])).catch(() => {});
    API.get('/tests/results/my').then(r => setResults(r.data.results || [])).catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-gray-900 mb-6">Psychological Tests</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-heading font-semibold text-lg mb-4">Available Tests</h2>
          {tests.length === 0 ? <p className="text-gray-500">No tests available</p> : (
            <div className="space-y-4">
              {tests.map((t) => (
                <Link key={t._id} to={`/dashboard/tests/${t._id}`} className="card p-5 hover:shadow-md transition block">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{t.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{t.description?.slice(0, 80)}...</p>
                      <div className="flex gap-3 mt-2">
                        <span className="text-xs text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{t.category}</span>
                        <span className="text-xs text-gray-500">{t.questions?.length || 0} questions</span>
                        <span className="text-xs text-gray-500">{t.duration} min</span>
                      </div>
                    </div>
                    <span className="btn-primary text-xs py-1.5 px-3">Start</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div>
          <h2 className="font-heading font-semibold text-lg mb-4">Previous Results</h2>
          {results.length === 0 ? <p className="text-gray-500">No results yet</p> : (
            <div className="space-y-3">
              {results.map((r) => (
                <Link key={r._id} to={`/dashboard/tests/result/${r._id}`} className="card p-4 hover:shadow-md transition flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.testId?.title}</p>
                    <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-teal-600">{r.result}</p>
                    <p className="text-xs text-gray-500">Score: {r.totalScore}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
