const express = require('express');
const router = express.Router();
const CodeAnalyzer = require('../services/CodeAnalyzer');

// POST route for code analysis
router.post('/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ 
        error: 'Code and language are required' 
      });
    }

    // Run code analysis
    const analysisResult = await CodeAnalyzer.analyze(code, language);
    
    res.json(analysisResult);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ 
      error: 'Internal server error during analysis' 
    });
  }
});

module.exports = router;