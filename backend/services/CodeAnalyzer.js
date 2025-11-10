const CodeReviewAI = require('../ai/CodeReviewAI');

class CodeAnalyzer {
  /**
   * Analyze code and return a comprehensive review
   * @param {string} code - The code to analyze
   * @param {string} language - Programming language
   * @returns {Object} Analysis results
   */
  static async analyze(code, language) {
    // Get AI analysis
    const aiFeedback = await CodeReviewAI.generateFeedback(code, language);
    
    // Calculate rating based on various factors
    const rating = this.calculateRating(code, aiFeedback);
    
    return {
      rating,
      feedback: aiFeedback,
      language,
      suggestions: aiFeedback.suggestions || [],
      warnings: aiFeedback.warnings || [],
      performance: aiFeedback.performance || [],
      readability: aiFeedback.readability || [],
      bestPractices: aiFeedback.bestPractices || []
    };
  }
  
  /**
   * Calculate a rating based on code metrics
   * @param {string} code - The code being analyzed
   * @param {Object} feedback - AI-generated feedback
   * @returns {number} Rating score (0-100)
   */
  static calculateRating(code, feedback) {
    let score = 100;
    
    // Deduct points based on issues found
    if (feedback.warnings && feedback.warnings.length > 0) {
      score -= feedback.warnings.length * 5;
    }
    
    if (feedback.suggestions && feedback.suggestions.length > 0) {
      score -= feedback.suggestions.length * 2;
    }
    
    // Consider code complexity - longer code with issues loses more points
    const codeLengthFactor = Math.min(code.length / 1000, 1); // Normalize to 0-1
    if (feedback.warnings && feedback.warnings.length > 0) {
      score -= codeLengthFactor * (feedback.warnings.length * 2);
    }
    
    // Ensure score is within 0-100 range
    return Math.max(0, Math.min(100, Math.round(score)));
  }
}

module.exports = CodeAnalyzer;