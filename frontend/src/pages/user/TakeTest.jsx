import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function TakeTest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get(`/tests/${id}`).then(r => setTest(r.data.test)).catch(() => {});
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const answerArray = test.questions.map((q, idx) => ({
        questionId: q._id, selectedOption: answers[idx] ?? 0, score: 0
      }));
      const { data } = await API.post('/tests/submit', { testId: id, answers: answerArray });
      toast.success('Test completed!');
      navigate(`/dashboard/tests/result/${data.result._id}`);
    } catch { toast.error('Failed to submit'); }
    setSubmitting(false);
  };

  if (!test) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div></div>;

  const question = test.questions[currentQ];
  const progress = ((currentQ + 1) / test.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-heading text-xl font-bold text-gray-900">{test.title}</h1>
        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-teal-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-gray-500 mt-2">Question {currentQ + 1} of {test.questions.length}</p>
      </div>
      <div className="card p-8">
        <h2 className="font-heading text-lg font-semibold text-gray-900 mb-6">{question.text}</h2>
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button key={idx} onClick={() => setAnswers({...answers, [currentQ]: idx})}
              className={`w-full text-left p-4 rounded-xl border-2 transition ${answers[currentQ] === idx ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <span className="font-medium text-gray-900">{opt.text}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0} className="btn-secondary text-sm disabled:opacity-50">Previous</button>
          {currentQ < test.questions.length - 1 ? (
            <button onClick={() => setCurrentQ(currentQ + 1)} className="btn-primary text-sm">Next</button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} className="btn-primary text-sm">{submitting ? 'Submitting...' : 'Submit Test'}</button>
          )}
        </div>
      </div>
    </div>
  );
}
