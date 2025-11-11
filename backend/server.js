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
const fs = require('fs');

// Try multiple possible build paths
const possiblePaths = [
  path.join(__dirname, '../frontend/build'),
  path.join(__dirname, '../../frontend/build'),
  path.join(process.cwd(), 'frontend/build'),
];

let buildPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    buildPath = p;
    break;
  }
}

console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Checked paths:', possiblePaths);
console.log('Build path found:', buildPath);

if (!buildPath) {
  console.warn('⚠️  WARNING: No build directory found in any expected location!');
  console.warn('Expected locations:');
  possiblePaths.forEach(p => console.warn('  - ', p));
  
  // List parent directory contents for debugging
  const parentDir = path.join(__dirname, '..');
  if (fs.existsSync(parentDir)) {
    console.log('Contents of', parentDir, ':', fs.readdirSync(parentDir));
  }
  
  // If on render, list root directory
  if (fs.existsSync('/opt/render/project')) {
    console.log('Contents of /opt/render/project:', fs.readdirSync('/opt/render/project'));
    if (fs.existsSync('/opt/render/project/src')) {
      console.log('Contents of /opt/render/project/src:', fs.readdirSync('/opt/render/project/src'));
    }
  }
} else {
  console.log('✓ Build directory found at:', buildPath);
  if (fs.existsSync(path.join(buildPath, 'index.html'))) {
    console.log('✓ index.html exists');
  }
  console.log('Build directory contents:', fs.readdirSync(buildPath));
}

if (buildPath) {
  app.use(express.static(buildPath));
}

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  if (!buildPath) {
    return res.status(500).send('Build directory not found. Please check server logs.');
  }
  
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
