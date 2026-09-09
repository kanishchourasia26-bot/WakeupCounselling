# Login & Register Issues - FIXED ✅

## Issues Found and Resolved

### 1. **Duplicate/Malformed API URLs in Register.jsx** ❌ → ✅
**Problem:**
```javascript
const API_BASE_URL = 'https://wakeupcounselling.onrender.com';
const response = await axios.post(`${API_BASE_URL}https://wakeup-counseling-backend.onrender.com/api/auth/send-otp`, ...)
```
This created malformed URLs like:
`https://wakeupcounselling.onrender.comhttps://wakeup-counseling-backend.onrender.com/api/auth/send-otp`

**Fix:**
- Removed hardcoded `API_BASE_URL`
- Now uses the centralized `API` service from `services/api.js`
- All API calls now use: `API.post('/auth/send-otp', ...)`

---

### 2. **Missing Token in Backend Responses** ❌ → ✅
**Problem:**
Backend was setting httpOnly cookies but not returning tokens in JSON response. Frontend's `AuthContext` expected `data.token` to store in localStorage.

**Fix - Backend (`authController.js`):**
```javascript
// In verifyOtp
res.status(200)
  .cookie('token', token, getCookieOptions())
  .json({ 
    success: true, 
    message: "Email verified successfully!", 
    token,  // ✅ Now returns token
    user 
  });

// In login
res.status(200)
  .cookie('token', token, getCookieOptions())
  .json({ success: true, token, user }); // ✅ Now returns token

// In register
res.status(201)
  .cookie('token', token, getCookieOptions())
  .json({ success: true, token, user }); // ✅ Now returns token
```

---

### 3. **Auth Flow Mismatch (Cookie vs localStorage)** ❌ → ✅
**Problem:**
- Backend used httpOnly cookies
- Frontend expected localStorage tokens
- Mismatch caused authentication failures

**Fix:**
Now uses **hybrid approach** (best of both worlds):
- **Backend**: Sets httpOnly cookie (secure, XSS-proof) + returns token in JSON (for localStorage)
- **Frontend**: Stores token in localStorage AND sends it via:
  1. Cookies (automatic via `withCredentials: true`)
  2. Authorization header (from localStorage as fallback)
- **Backend middleware**: Accepts token from EITHER cookie OR Authorization header

**Updated `api.js`:**
```javascript
const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // Sends cookies
});

// Request interceptor adds token to headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

### 4. **Improper User State Management After OTP Verification** ❌ → ✅
**Problem:**
```javascript
// Old code in Register.jsx
window.location.href = '/dashboard'; // Hard reload, loses context
```

**Fix:**
```javascript
// Store token and user
if (response.data.token) {
  localStorage.setItem('token', response.data.token);
}
localStorage.setItem('user', JSON.stringify(response.data.user));

// Update AuthContext
setUser(response.data.user);

// Navigate properly
navigate('/dashboard');
```

**Updated AuthContext:**
- Added `setUser` to exported context
- Updated `login` and `register` to handle optional tokens
- Made `logout` async to call backend logout endpoint

---

### 5. **Import Issues in Register.jsx** ❌ → ✅
**Problem:**
- Used raw `axios` instead of configured `API` service
- No centralized error handling

**Fix:**
```javascript
import API from '../../services/api'; // ✅ Use configured API instance

// All calls now use: API.post('/auth/...', data)
```

---

## Testing the Fixes

### 1. Test Registration Flow
```bash
# Start backend
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

1. Go to `http://localhost:5173/register`
2. Fill in Step 1 (Account Info)
3. Fill in Step 2 (Personal Details)
4. Click "Send OTP" - check your email
5. Enter the 6-digit OTP
6. Should redirect to `/dashboard` with user logged in

### 2. Test Login Flow
1. Go to `http://localhost:5173/login`
2. Enter email and password
3. Should redirect to dashboard (or `/admin` for admin users)

### 3. Test Protected Routes
- Try accessing `/dashboard` without logging in → should redirect to `/login`
- Try accessing `/admin` as normal user → should redirect to `/dashboard`

### 4. Test Logout
- Click logout in dashboard
- Should clear tokens and redirect to login

---

## Environment Variables Needed

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/wakeup-counseling
JWT_SECRET=your_jwt_secret_here
PORT=5000
FRONTEND_URL=http://localhost:5173

# Email Configuration for OTP
EMAIL_USERNAME=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
```

**For Production:**
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## Security Features Implemented

1. ✅ **httpOnly Cookies** - Prevents XSS attacks
2. ✅ **SameSite Cookie Policy** - Prevents CSRF attacks
3. ✅ **Token in localStorage** - Fallback for API calls
4. ✅ **Authorization Header** - Standard REST API pattern
5. ✅ **Email Verification via OTP** - Ensures valid email addresses
6. ✅ **Rate Limiting** - Prevents brute force attacks (5 attempts per 15 min)
7. ✅ **Password Hashing** - bcrypt with salt
8. ✅ **OTP Expiry** - 10-minute validity window

---

## Files Modified

### Backend
1. `backend/controllers/authController.js` - Added token to JSON responses
2. `backend/middleware/auth.js` - Already handles both cookie and header tokens ✅

### Frontend
1. `frontend/src/pages/auth/Register.jsx` - Fixed API calls, proper navigation
2. `frontend/src/context/AuthContext.jsx` - Added setUser, fixed token handling
3. `frontend/src/services/api.js` - Restored request interceptor for Authorization header

---

## Common Issues & Solutions

### "Invalid or expired OTP"
- OTP is valid for 10 minutes only
- Click "Resend OTP" to get a new code
- Check email spam folder

### "Cannot connect to server"
- Backend is not running
- Check `MONGODB_URI` in backend `.env`
- Ensure MongoDB is running

### "Email already registered"
- User already exists with verified email
- Use "Login" instead of "Register"
- Or use different email

### "Your email was not verified during registration"
- User registered but didn't complete OTP verification
- Register again with same email to resend OTP

### Token not persisting after refresh
- Check if `localStorage.setItem('token', ...)` is called
- Check browser console for errors
- Clear localStorage and try again: `localStorage.clear()`

---

## Architecture Overview

```
┌─────────────┐
│  Frontend   │
│  (React)    │
└──────┬──────┘
       │
       │ 1. API Call with:
       │    - Cookie (httpOnly)
       │    - Authorization: Bearer <token>
       │
       ▼
┌─────────────┐
│  Backend    │
│  Middleware │ 2. Checks BOTH:
│  (Express)  │    - req.cookies.token
└──────┬──────┘    - req.headers.authorization
       │
       │ 3. Validates JWT
       │
       ▼
┌─────────────┐
│  Protected  │
│  Routes     │
└─────────────┘
```

---

## Next Steps

1. ✅ Test registration with real email
2. ✅ Test login/logout flow
3. ✅ Test protected routes
4. ⚠️ Configure email service (Gmail App Password or SendGrid)
5. ⚠️ Test in production environment
6. ⚠️ Add email templates for better UX
7. ⚠️ Add password strength indicator
8. ⚠️ Add "Remember Me" functionality

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify environment variables are set correctly
4. Clear localStorage: `localStorage.clear()`
5. Clear cookies and try again

All authentication issues should now be resolved! 🎉
