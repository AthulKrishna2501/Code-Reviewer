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
console.log('Serving frontend from:', buildPath);
console.log('NODE_ENV:', process.env.NODE_ENV);

app.use(express.static(buildPath));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.resolve(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
