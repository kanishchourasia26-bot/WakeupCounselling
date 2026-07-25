# Backend Fixes Summary

## Issues Fixed

### 1. Database Connection Not Awaited (server.js)
**Problem:** `connectDB()` was called without `await`, so the server started listening before MongoDB was connected. All early requests failed silently.

**Fix:** Wrapped server startup in an async function and properly awaited the database connection:
```javascript
async function startServer() {
  try {
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('FATAL: Could not connect to MongoDB:', error.message);
    process.exit(1);
  }
  // ... rest of server setup
}
startServer();
```

### 2. Environment Variables Not Loading (server.js)
**Problem:** `require('dotenv').config()` resolves `.env` relative to `process.cwd()`, not the script directory. Running the server from a different folder caused env vars to be missing.

**Fix:** Explicitly set the path to `.env`:
```javascript
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
```

### 3. No Error Handling for MongoDB Connection Failure (server.js)
**Problem:** If MongoDB wasn't running, the server crashed with no useful error message.

**Fix:** Added proper error handling with clear instructions:
```javascript
catch (error) {
  console.error('FATAL: Could not connect to MongoDB:', error.message);
  console.error('Make sure MongoDB is running. Check your MONGODB_URI in .env');
  process.exit(1);
}
```

### 4. Route Ordering Bug (routes/tests.js)
**Problem:** `GET /:id` was defined before `GET /results/my`, so requesting `/tests/results/my` matched `/:id` with `id="results"` instead of hitting the results route.

**Fix:** Reordered routes so specific paths come before parameterized routes:
```javascript
// Specific routes first
router.get('/results/my', protect, ctrl.getUserResults);
router.get('/results/:id', protect, ctrl.getResultById);
router.get('/results', protect, admin, ctrl.getAllResults);

// Parameterized routes after
router.get('/:id', ctrl.getTestById);
```

### 5. Frontend API Base URL Not Configurable (services/api.js)
**Problem:** `baseURL: '/api'` is a relative path. In production builds, there's no Vite proxy, so API calls failed.

**Fix:** Made the API base URL configurable via environment variable:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});
```

### 6. Poor Error Messages in Auth Pages (Login.jsx, Register.jsx)
**Problem:** Generic error messages like "Login failed" didn't help users understand what went wrong.

**Fix:** Added better error handling with specific messages:
```javascript
catch (err) {
  const message = err.response?.data?.message || 
                 (err.code === 'ECONNREFUSED' ? 'Cannot connect to server. Please try again later.' :
                 'Login failed. Please check your credentials and try again.');
  toast.error(message);
}
```

### 7. Missing .env.example Files
**Problem:** No example environment files for users to reference.

**Fix:** Added `.env.example` files for both backend and frontend with clear documentation.

### 8. Missing Frontend Serving in Production (server.js)
**Problem:** The backend didn't serve the frontend build in production mode.

**Fix:** Added static file serving for the frontend dist folder:
```javascript
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDist, 'index.html'));
  }
});
```

## Files Modified

1. `/backend/server.js` - Complete rewrite with proper async startup
2. `/backend/routes/tests.js` - Fixed route ordering
3. `/backend/.env.example` - Added example environment file
4. `/frontend/src/services/api.js` - Made API URL configurable
5. `/frontend/src/pages/auth/Login.jsx` - Better error handling
6. `/frontend/src/pages/auth/Register.jsx` - Better error handling
7. `/frontend/.env` - Added development environment config
8. `/frontend/.env.example` - Added example environment file
9. `/README.md` - Updated with troubleshooting section

## How to Test

### 1. Start MongoDB
```bash
mongod
# or use MongoDB Atlas
```

### 2. Start Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your settings
npm install
npm run seed
npm run dev
```

You should see:
```
Database connected successfully
Server running on port 5000
API: http://localhost:5000/api/health
```

### 3. Test API Directly
```bash
curl http://localhost:5000/api/health
# Should return: {"success":true,"message":"Wake Up Counselling API is running"}
```

### 4. Test Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123","phone":"1234567890"}'
```

Should return:
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

### 5. Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Should return the same structure with token and user.

### 6. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 and test registration/login through the UI.

## Common Issues

### "Cannot connect to server"
- MongoDB is not running
- Backend is not running
- Check `backend/.env` has correct `MONGODB_URI`

### "Invalid credentials"
- Check email and password are correct
- Try registering a new account
- Check backend logs for errors

### "Email already registered"
- The email is already in the database
- Use a different email or delete the existing user

### Frontend can't connect to backend (production)
- Set `VITE_API_URL` in `frontend/.env` to your backend URL
- Example: `VITE_API_URL=https://api.yourdomain.com/api`
- Rebuild frontend: `npm run build`
