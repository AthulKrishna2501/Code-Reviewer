const express = require('express');
const cors = require('cors');
const path = require('path');
const codeReviewRoutes = require('./routes/codeReview');

const app = express();
const PORT = process.env.PORT || 5001;

// Ensure working directory is project root so frontend/build can be found
try {
  const projectRoot = path.join(__dirname, '..');
  process.chdir(projectRoot);
  console.log('Changed working directory to project root:', process.cwd());
} catch (err) {
  console.warn('Could not change working directory:', err.message);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api', codeReviewRoutes);

// Serve static assets
const fs = require('fs');

// Determine the build path based on current working directory
const buildPath = path.join(process.cwd(), 'frontend', 'build');

console.log('=== Server Configuration ===');
console.log('Process CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Build path:', buildPath);
console.log('Build path exists:', fs.existsSync(buildPath));

if (fs.existsSync(buildPath)) {
  const indexPath = path.join(buildPath, 'index.html');
  console.log('✓ Build directory found');
  console.log('index.html exists:', fs.existsSync(indexPath));
  console.log('Build directory contents:', fs.readdirSync(buildPath));
} else {
  console.warn('⚠️  WARNING: Build directory does not exist at', buildPath);
  console.log('Frontend directory contents:', fs.existsSync(path.join(process.cwd(), 'frontend')) ? fs.readdirSync(path.join(process.cwd(), 'frontend')) : 'frontend dir not found');
}

// Serve static files from build directory
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  console.log('✓ Static file serving configured');
} else {
  console.warn('⚠️  Static file serving NOT configured - build directory missing');
  console.log('CWD contents:', fs.readdirSync(process.cwd()));
}

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  if (!fs.existsSync(buildPath)) {
    return res.status(500).json({ 
      error: 'Build directory not found',
      buildPath: buildPath,
      cwd: process.cwd()
    });
  }
  
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
    res.status(404).json({ 
      error: 'index.html not found',
      indexPath: indexPath
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
