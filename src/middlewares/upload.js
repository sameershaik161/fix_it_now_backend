const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage based on environment
const storage = process.env.VERCEL
  ? multer.memoryStorage()  // Use memory storage on Vercel
  : multer.diskStorage({  // Use disk storage locally
      destination: function(req, file, cb) {
        const uploadsDir = path.join(__dirname, '../../uploads');
        // Only create directory locally
        if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
      },
      filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
      }
    });

const fileFilter = (req, file, cb) => {
  // accept images only
  if(!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5*1024*1024 } });

module.exports = upload;
