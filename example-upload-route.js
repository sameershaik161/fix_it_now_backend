// Example route handler for file uploads
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (process.env.VERCEL) {
      // Handle file in memory
      const file = req.file;
      // Here you would typically:
      // 1. Upload to cloud storage (S3, Azure Blob, etc.)
      // 2. Save the URL to your database
      res.json({ 
        message: 'File uploaded successfully',
        filename: file.originalname,
        size: file.size
      });
    } else {
      // Local development - file is already saved to disk
      res.json({ 
        message: 'File uploaded successfully',
        filename: req.file.filename,
        path: req.file.path
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});