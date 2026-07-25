import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/forgot-password', { email });
      setToken(data.resetToken);
      toast.success('Reset token generated. In production, this would be emailed to you.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center"><span className="text-white font-bold text-xl">W</span></div>
            <div className="text-left"><span className="font-heading font-bold text-xl text-gray-900">Wake Up</span><span className="block text-xs text-teal-600 -mt-1">Counselling</span></div>
          </Link>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-gray-500 mt-1">Enter your email to reset password</p>
        </div>
        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="your@email.com" />
          </div>
          {token && (
            <div className="p-3 bg-teal-50 rounded-lg text-sm text-teal-700">
              Reset token: <code className="font-mono break-all">{token}</code>
              <br /><Link to={`/reset-password/${token}`} className="underline font-medium">Click here to reset</Link>
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Processing...' : 'Get Reset Token'}</button>
          <p className="text-center text-sm"><Link to="/login" className="text-teal-600 hover:text-teal-700">Back to login</Link></p>
        </form>
      </div>
    </div>
  );
}
