const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// 1. Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Set up the Cloudinary storage engine
const storage = (folder) => new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: `wakeup-counseling/${folder}`, // Organizes files in Cloudinary folders
    resource_type: 'auto', // Allows both images and raw files (like PDFs)
    allowed_formats: ['jpeg', 'jpg', 'png', 'gif', 'webp', 'pdf'],
    // Cloudinary automatically generates a secure, unique filename
  },
});

// 3. Keep your existing file validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'), false);
  }
};

// 4. Export the upload middleware
exports.upload = (folder) => multer({
  storage: storage(folder),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});