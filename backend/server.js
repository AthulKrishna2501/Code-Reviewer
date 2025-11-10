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

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Print where it's looking for the build
  console.log('Serving frontend from:', path.join(__dirname, '../frontend/build'));

  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
