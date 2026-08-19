import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import axios from 'axios'; // API calls ke liye axios import kiya

export default function Register() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(''); // 👈 OTP store karne ke liye state
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    occupation: '',
    emergencyContact: ''
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  // Agar aapka backend URL alag hai toh yahan adjust kar lena (e.g., 'http://localhost:5000')
  const API_BASE_URL = 'https://wakeupcounselling.onrender.com';

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (!form.fullName.trim()) return toast.error('Full name is required');
    if (!form.email.trim()) return toast.error('Email is required');
    if (!form.phone.trim()) return toast.error('Phone number is required');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  // ========================================================
  // STEP 2 SUBMIT: SEND OTP TO EMAIL
  // ========================================================
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend ke send-otp route par data bhejo
      const response = await axios.post(`${API_BASE_URL}https://wakeup-counseling-backend.onrender.com/api/auth/send-otp`, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth || undefined,
        address: form.address,
        occupation: form.occupation,
        emergencyContact: form.emergencyContact
      });

      if (response.data.success) {
        toast.success('Verification code sent to your email!');
        setStep(3); // 👈 OTP Screen par le jao
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // STEP 3 SUBMIT: VERIFY OTP AND LOGIN
  // ========================================================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      return toast.error('Please enter the 6-digit verification code');
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}https://wakeup-counseling-backend.onrender.com/api/auth/verify-otp`, {
        email: form.email,
        otp: otp
      }, {
        withCredentials: true // Cookie safe rakhne ke liye
      });

      if (response.data.success) {
        toast.success('Email verified! Welcome aboard.');
        // Page reload karke dashboard par bhejo taaki AuthContext updated user fetch kar le
        window.location.href = '/dashboard';
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================================
  // RESEND OTP HANDLER
  // ========================================================
  const handleResendOTP = async () => {
    const toastId = toast.loading('Resending OTP...');
    try {
      await axios.post(`${API_BASE_URL}https://wakeup-counseling-backend.onrender.com/api/auth/send-otp`, form);
      toast.success('New OTP sent to your email!', { id: toastId });
    } catch (err) {
      toast.error('Failed to resend OTP', { id: toastId });
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex items-center justify-center px-4 py-12">
  <div className="w-full max-w-lg">
    {/* Logo */}
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center gap-3 mb-6">
        
        {/* 👇 YAHAN CHANGE KIYA HAI 👇 */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200 overflow-hidden bg-white">
          <img 
            src="public/images/logo.png" 
            alt="Wake Up Counselling Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        {/* 👆 ---------------------- 👆 */}

        <div className="text-left">
          <span className="font-heading font-bold text-xl text-gray-900">Wake Up</span>
          <span className="block text-xs text-teal-600 -mt-1">Counselling</span>
        </div>
      </Link>
      <h1 className="font-heading text-2xl font-bold text-gray-900">
        {step === 3 ? 'Verify Your Email' : 'Create Your Account'}
      </h1>
      <p className="text-gray-500 mt-1">
        {step === 3 
          ? `We've sent a 6-digit code to ${form.email}` 
          : 'Start your journey to better mental health'}
      </p>
    </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <span className="text-sm font-medium hidden sm:inline">Account Info</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-teal-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <span className="text-sm font-medium hidden sm:inline">Personal Details</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-teal-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-teal-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
            <span className="text-sm font-medium hidden sm:inline">Verify Email</span>
          </div>
        </div>

        {/* Step 1: Account Info */}
        {step === 1 && (
          <form onSubmit={handleNext} className="card p-8 space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={e => update('fullName', e.target.value)}
                className="input-field"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => update('email', e.target.value)}
                className="input-field"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => update('phone', e.target.value)}
                className="input-field"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => update('password', e.target.value)}
                className="input-field"
                placeholder="Minimum 6 characters"
              />
              {form.password && form.password.length < 6 && (
                <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                className="input-field"
                placeholder="Re-enter your password"
              />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full text-base">
              Continue &rarr;
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700 transition">
                Sign in
              </Link>
            </p>
          </form>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <form onSubmit={handleSendOTP} className="card p-8 space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                <select
                  value={form.gender}
                  onChange={e => update('gender', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={e => update('dateOfBirth', e.target.value)}
                  className="input-field"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
              <input
                type="text"
                value={form.occupation}
                onChange={e => update('occupation', e.target.value)}
                className="input-field"
                placeholder="e.g. Student, Engineer, Teacher"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
              <textarea
                rows={2}
                value={form.address}
                onChange={e => update('address', e.target.value)}
                className="input-field resize-none"
                placeholder="Your full address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Emergency Contact</label>
              <input
                type="tel"
                value={form.emergencyContact}
                onChange={e => update('emergencyContact', e.target.value)}
                className="input-field"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary flex-1 text-center"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP &rarr;'
                )}
              </button>
            </div>

            <p className="text-center text-xs text-gray-400">
              You can update these details anytime from your profile settings.
            </p>
          </form>
        )}

        {/* Step 3: OTP Verification Screen (NEW) */}
        {step === 3 && (
          <form onSubmit={handleVerifyOTP} className="card p-8 space-y-6 animate-fade-in">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter 6-Digit Verification Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength="6"
                required
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} // Sirf numbers allowed
                className="input-field text-center text-2xl tracking-widest font-bold py-3"
                placeholder="••••••"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-base py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify & Complete Registration'
              )}
            </button>

            <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                &larr; Back to Details
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-teal-600 hover:text-teal-700 font-semibold"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* Terms */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By creating an account, you agree to our{' '}
          <span className="text-teal-600 cursor-pointer hover:underline">Terms of Service</span>{' '}
          and{' '}
          <span className="text-teal-600 cursor-pointer hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}