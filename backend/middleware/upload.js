/**
 * middleware/upload.js — Image Upload via Multer + Cloudinary
 * Falls back to local memory storage if Cloudinary is not configured.
 */

const multer = require('multer');
const path = require('path');

// ─── Cloudinary Upload (if configured) ──────────────────────────────────────
let upload;

if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'cafe-menu',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 600, crop: 'fill', quality: 'auto' }],
    },
  });

  upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp/;
      const ext = allowed.test(path.extname(file.originalname).toLowerCase());
      const mime = allowed.test(file.mimetype);
      if (ext && mime) return cb(null, true);
      cb(new Error('Only image files (jpg, png, webp) are allowed'));
    },
  });

  console.log('📸 Cloudinary storage configured');
} else {
  // ─── Fallback: Memory Storage ─────────────────────────────────────────────
  upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|webp/;
      const ext = allowed.test(path.extname(file.originalname).toLowerCase());
      if (ext) return cb(null, true);
      cb(new Error('Only image files are allowed'));
    },
  });

  console.log('💾 Local memory storage configured (no Cloudinary)');
}

module.exports = upload;
