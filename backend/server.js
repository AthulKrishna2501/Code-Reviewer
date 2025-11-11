const express = require('express');
const cors = require('cors');
const path = require('path');
const codeReviewRoutes = require('./routes/codeReview');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', codeReviewRoutes);

// Serve static assets
const buildPath = path.join(__dirname, '../frontend/build');
const fs = require('fs');

console.log('Current directory:', __dirname);
console.log('Serving frontend from:', buildPath);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Build path exists:', fs.existsSync(buildPath));
console.log('index.html exists:', fs.existsSync(path.join(buildPath, 'index.html')));

// List directory contents for debugging
if (fs.existsSync(buildPath)) {
  console.log('Build directory contents:', fs.readdirSync(buildPath));
} else {
  console.warn('⚠️  WARNING: Build directory does not exist at', buildPath);
}

app.use(express.static(buildPath));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.resolve(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
    res.status(404).send('index.html not found. Build directory may not exist.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
