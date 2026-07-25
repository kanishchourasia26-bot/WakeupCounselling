import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';

export default function TestResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  useEffect(() => {
    API.get(`/tests/results/${id}`).then(r => setResult(r.data.result)).catch(() => {});
  }, [id]);

  if (!result) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link to="/dashboard/tests" className="text-teal-600 text-sm mb-4 inline-block">&larr; Back to Tests</Link>
      <div className="card p-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-gray-900">{result.testId?.title}</h1>
          <p className="text-gray-500 mt-1">Completed on {new Date(result.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="bg-teal-50 rounded-2xl p-8 text-center mb-8">
          <p className="text-sm text-teal-600 font-medium mb-2">Your Result</p>
          <h2 className="font-heading text-3xl font-bold text-teal-700">{result.result}</h2>
          <p className="text-lg text-gray-600 mt-2">Score: {result.totalScore}</p>
        </div>
        {result.resultDescription && (
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Assessment</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{result.resultDescription}</p>
          </div>
        )}
        <div className="flex gap-3">
          <Link to="/dashboard/tests" className="btn-secondary text-sm flex-1 text-center">Take Another Test</Link>
          <Link to="/dashboard/bookings/new" className="btn-primary text-sm flex-1 text-center">Book Counseling</Link>
        </div>
      </div>
    </div>
  );
}
