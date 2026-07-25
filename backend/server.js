const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// --- Start server only after DB is connected ---
async function startServer() {
  try {
    await connectDB();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('FATAL: Could not connect to MongoDB:', error.message);
    console.error('Make sure MongoDB is running. Check your MONGODB_URI in .env');
    process.exit(1);
  }

  // --- Middleware ---
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // --- API Routes ---
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/bookings', require('./routes/bookings'));
  app.use('/api/slots', require('./routes/slots'));
  app.use('/api/tests', require('./routes/tests'));
  app.use('/api/notifications', require('./routes/notifications'));
  app.use('/api/blogs', require('./routes/blogs'));
  app.use('/api/resources', require('./routes/resources'));
  app.use('/api/feedback', require('./routes/feedback'));
  app.use('/api/contacts', require('./routes/contacts'));
  app.use('/api/content', require('./routes/content'));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Wake Up Counselling API is running' });
  });

  // Serve frontend build in production
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });

  // Error handler (must be last)
  app.use(errorHandler);

  // --- Listen ---
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}/api/health`);
  });
}

startServer();
