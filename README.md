# Wake Up Counselling - MERN Stack Application

Complete migration from PHP/MySQL to MERN (MongoDB, Express.js, React, Node.js) stack.

## Project Structure

```
wakeup-counseling/
├── backend/                    # Express.js API Server
│   ├── config/                 # Database configuration
│   ├── controllers/            # Business logic
│   │   ├── authController.js   # Authentication (register, login, JWT)
│   │   ├── bookingController.js # Session booking management
│   │   ├── slotController.js   # Available slots & holidays
│   │   ├── testController.js   # Psychological tests
│   │   ├── blogController.js   # Blog management
│   │   ├── resourceController.js # Resources & bookmarks
│   │   ├── notificationController.js # Notifications
│   │   ├── feedbackController.js # User feedback/ratings
│   │   ├── contactController.js # Contact form
│   │   └── contentController.js # CMS, banners, gallery, events, workshops
│   ├── middleware/             # Auth, error handling, file uploads
│   ├── models/                 # Mongoose schemas (18 models)
│   ├── routes/                 # REST API routes
│   ├── utils/                  # Helpers & seed script
│   ├── uploads/                # File upload directories
│   ├── server.js               # Entry point
│   └── .env                    # Environment variables
│
└── frontend/                   # React (Vite) + Tailwind CSS
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── context/            # AuthContext provider
    │   ├── layouts/            # Public, Dashboard, Admin layouts
    │   ├── pages/
    │   │   ├── public/         # Home, About, Mission, Contact, Services, Workshops, Gallery, Events
    │   │   ├── auth/           # Login, Register, Forgot/Reset Password
    │   │   ├── user/           # Dashboard, Profile, Bookings, Tests, Notifications, Resources, Feedback
    │   │   └── admin/          # Admin Dashboard, Bookings, Slots, Users, Blogs, Resources, Content, Feedback
    │   ├── services/           # Axios API client
    │   ├── App.jsx             # Router & protected routes
    │   └── main.jsx            # Entry point
    └── public/                 # Static assets & images
```

## MongoDB Schemas

| Model | Description |
|-------|-------------|
| User | Users with role-based access (user/admin), profile fields |
| Booking | Session bookings with status workflow (Pending→Confirmed→Completed) |
| AvailableSlot | Counselor available time slots per date |
| Holiday | Blocked dates/holidays |
| PsychologicalTest | Tests with questions, options, scoring rules |
| TestResult | User test attempts with scores and results |
| Blog | Blog posts with categories |
| Resource | Articles, PDFs, Videos with bookmarks |
| Notification | User notifications for all events |
| Feedback | Session ratings and reviews |
| Contact | Contact form submissions |
| Testimonial | Client testimonials |
| Gallery | Photo gallery items |
| Event | Events/Services |
| Workshop | Workshops/Courses |
| CMS | Content management blocks |
| Banner | Homepage carousel banners |
| FAQ | Frequently asked questions |
| SiteDetails | Global site configuration |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - User's bookings
- `GET /api/bookings/:id` - Booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/respond` - Accept/decline suggested slot
- `GET /api/bookings` - All bookings (admin)
- `PUT /api/bookings/:id/status` - Update status (admin)
- `PUT /api/bookings/:id/suggest` - Suggest alternate slot (admin)

### Slots
- `GET /api/slots` - Get available slots
- `POST /api/slots` - Create slot (admin)
- `GET /api/slots/holidays` - Get holidays
- `POST /api/slots/holidays` - Block holiday (admin)

### Psychological Tests
- `GET /api/tests` - List tests
- `GET /api/tests/:id` - Test details
- `POST /api/tests/submit` - Submit test answers
- `GET /api/tests/results/my` - User's results
- `GET /api/tests/results/:id` - Result details

### Content
- `GET /api/content/banners` - Homepage banners
- `GET /api/content/events` - Events/Services
- `GET /api/content/workshops` - Workshops
- `GET /api/content/gallery` - Gallery
- `GET /api/content/testimonials` - Testimonials
- `GET /api/content/faqs` - FAQs
- `GET /api/content/cms/:key` - CMS content
- `GET /api/content/site-details` - Site configuration

### Other
- `POST /api/contacts` - Contact form
- `GET /api/blogs` - Blog listing
- `GET /api/resources` - Resources
- `POST /api/feedback` - Submit feedback
- `GET /api/notifications` - User notifications

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wakeup_counseling
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
FRONTEND_URL=http://localhost:5173
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB 6+ (must be running)

### Setup

```bash
# 1. Clone/copy the project
cd wakeup-counseling

# 2. Install backend dependencies
cd backend
npm install

# 3. Configure backend environment
cp .env.example .env
# Edit .env and set your MONGODB_URI and JWT_SECRET

# 4. Install frontend dependencies
cd ../frontend
npm install

# 5. Configure frontend environment (optional for dev)
cp .env.example .env
# For development, leave VITE_API_URL empty (uses Vite proxy)
# For production, set VITE_API_URL=https://your-api-domain.com/api
```

### Start MongoDB

Make sure MongoDB is running before starting the backend:

```bash
# Option 1: Local MongoDB
mongod

# Option 2: MongoDB Atlas (cloud)
# Set MONGODB_URI in backend/.env to your Atlas connection string
```

### Seed Database

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@wakeupcounseling.com` / `Admin123@#$`
- Demo user: `demo@example.com` / `Demo123456`
- Site content, CMS data, psychological tests, workshops, events

### Run Development

Open TWO terminal windows:

**Terminal 1 - Backend (API server):**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend (React dev server):**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

The Vite dev server automatically proxies `/api` requests to the backend.

### Build for Production

```bash
# Build frontend
cd frontend
npm run build

# The backend serves the frontend build automatically
# Just start the backend:
cd ../backend
npm start
```

Visit: http://localhost:5000

## Deployment

### Backend
1. Set environment variables on your hosting platform
2. Ensure MongoDB is accessible (MongoDB Atlas recommended)
3. Run `npm start`

### Frontend
1. Build with `npm run build`
2. Serve the `dist/` folder with any static hosting (Vercel, Netlify, etc.)
3. Or serve from Express by adding static middleware

### Recommended Stack
- Backend: Railway, Render, or AWS EC2
- Database: MongoDB Atlas
- Frontend: Vercel or Netlify
- File Storage: Cloudinary or AWS S3 (for production)

## Troubleshooting

### "Cannot connect to server" or login/register fails

1. **Check MongoDB is running:**
   ```bash
   mongod --version
   # or check if MongoDB service is running
   ```

2. **Check backend is running:**
   ```bash
   cd backend
   npm run dev
   # Should see: "Server running on port 5000"
   # and: "Database connected successfully"
   ```

3. **Check .env file exists in backend/:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit MONGODB_URI and JWT_SECRET
   ```

4. **Test the API directly:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"success":true,"message":"Wake Up Counselling API is running"}
   ```

5. **Check frontend proxy (dev mode):**
   - The Vite dev server proxies `/api` to `http://localhost:5000`
   - Make sure both servers are running

6. **Production build:**
   - Set `VITE_API_URL` in `frontend/.env` to your backend API URL
   - Example: `VITE_API_URL=https://api.yourdomain.com/api`

## Key Features Migrated & Improved

| Feature | Original (PHP) | New (MERN) |
|---------|---------------|------------|
| Auth | Session-based, plain passwords | JWT, bcrypt hashing |
| SQL Injection | Vulnerable | Mongoose parameterized queries |
| Booking | Simple form submission | Full workflow (Pending→Confirmed→Completed) |
| Slot Management | None | Date/time slot management with holidays |
| Psychological Tests | None | 3 tests with scoring rules (PHQ-9, GAD-7, Stress) |
| User Dashboard | None | Complete dashboard with bookings, tests, notifications |
| Notifications | None | Real-time notification system |
| Resources | None | Articles, PDFs, Videos with bookmarks |
| Feedback | None | Post-session rating and review system |
| UI | Bootstrap 3, outdated | Tailwind CSS, modern responsive design |
| Admin Panel | Basic CRUD | Full management panel with analytics |
| API | None (server-rendered) | RESTful API with proper error handling |
