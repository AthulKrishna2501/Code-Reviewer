class CodeReviewAI {
  /**
   * Generate AI feedback for the given code
   * @param {string} code - The code to analyze
   * @param {string} language - Programming language
   * @returns {Object} Feedback object containing suggestions, warnings, etc.
   */
  static async generateFeedback(code, language) {
    // Analyze code based on language
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return this.analyzeJavaScript(code);
      case 'python':
      case 'py':
        return this.analyzePython(code);
      case 'java':
        return this.analyzeJava(code);
      case 'go':
        return this.analyzeGo(code);
      default:
        return this.analyzeGeneric(code);
    }
  }

  /**
   * Analyze JavaScript code
   * @param {string} code - JavaScript code
   * @returns {Object} Analysis results
   */
  static analyzeJavaScript(code) {
    const feedback = {
      suggestions: [],
      warnings: [],
      performance: [],
      readability: [],
      bestPractices: []
    };

    // Check for common JavaScript issues
    if (code.includes('var ')) {
      feedback.warnings.push('Prefer "const" or "let" over "var" for variable declarations to avoid hoisting issues and improve scope management.');
    }

    if (code.includes('==') || code.includes('!=')) {
      feedback.warnings.push('Use strict equality (===) and inequality (!==) operators instead of == and != to avoid type coercion issues.');
    }

    if (code.includes('eval(')) {
      feedback.warnings.push('Avoid using eval() as it can be a security risk and often indicates a design problem.');
    }

    if (code.includes('document.write(')) {
      feedback.warnings.push('Avoid using document.write() as it can overwrite the entire document if used after page load.');
    }

    // Check for performance issues
    if ((code.match(/for\s*\(\s*var\s+\w+\s*=\s*0;\s*\w+\s*<\s*\w+\.length;\s*\w+\+\+\s*\)/g) || []).length > 0) {
      feedback.performance.push('Cache the length property in a variable for performance when using it in a for loop condition.');
    }

    // Check for readability issues
    if (code.length > 1000 && (code.match(/\n/g) || []).length > 50) {
      feedback.readability.push('Consider breaking down large functions into smaller, more manageable functions.');
    }

    // Best practices
    if (!code.includes('//') && !code.includes('/*')) {
      feedback.bestPractices.push('Add comments to explain complex logic and improve code maintainability.');
    }

    return feedback;
  }

  /**
   * Analyze Python code
   * @param {string} code - Python code
   * @returns {Object} Analysis results
   */
  static analyzePython(code) {
    const feedback = {
      suggestions: [],
      warnings: [],
      performance: [],
      readability: [],
      bestPractices: []
    };

    // Check for common Python issues
    if (code.includes('import *')) {
      feedback.warnings.push("Avoid using 'from module import *' as it clutters the namespace and makes it unclear which names are present in the namespace.");
    }

    if (code.includes('eval(') || code.includes('exec(')) {
      feedback.warnings.push('Avoid using eval() or exec() as they can be security risks.');
    }

    if ((code.match(/range\(\s*\d+\s*\)/g) || []).length > 2 && !code.includes('xrange')) {
      feedback.performance.push('For large ranges in Python 2, use xrange() instead of range() to avoid creating a list in memory.');
    }

    if (code.includes('l = ') || code.includes('O = ') || code.includes('o = ')) {
      feedback.readability.push("Avoid using 'l', 'O', or 'o' as variable names as they can be confused with '1' and '0'.");
    }

    // Best practices
    if (!code.includes('#') && !code.includes('"""') && !code.includes("'''")) {
      feedback.bestPractices.push('Add docstrings and comments to explain the purpose of functions and complex logic.');
    }

    if (!code.includes('if __name__ == "__main__"')) {
      feedback.bestPractices.push('Consider adding if __name__ == "__main__" block to allow the module to be run as a script.');
    }

    return feedback;
  }

  /**
   * Analyze Java code
   * @param {string} code - Java code
   * @returns {Object} Analysis results
   */
  static analyzeJava(code) {
    const feedback = {
      suggestions: [],
      warnings: [],
      performance: [],
      readability: [],
      bestPractices: []
    };

    // Check for common Java issues
    if (code.includes('System.out.println')) {
      feedback.warnings.push('Use a proper logging framework instead of System.out.println for production code.');
    }

    if (code.includes('public class') && !code.includes('public static void main')) {
      feedback.bestPractices.push('Ensure your public class has a proper main method if it is meant to be executed.');
    }

    // Check for performance issues
    if (code.includes('StringBuffer') && !code.includes('StringBuilder')) {
      feedback.performance.push('Use StringBuilder instead of StringBuffer for better performance unless thread safety is required.');
    }

    // Best practices
    if (!code.includes('//') && !code.includes('/*')) {
      feedback.bestPractices.push('Add comments and JavaDoc to explain the purpose of classes, methods, and complex logic.');
    }

    return feedback;
  }

  /**
   * Analyze Go code
   * @param {string} code - Go code
   * @returns {Object} Analysis results
   */
  static analyzeGo(code) {
    const feedback = {
      suggestions: [],
      warnings: [],
      performance: [],
      readability: [],
      bestPractices: []
    };

    // Check for common Go issues
    if (code.includes('_ = ') && !code.includes('err')) {
      feedback.warnings.push('If ignoring a return value, use the blank identifier (_) only for error values. Assign other values to named variables for clarity.');
    }

    if (code.includes('panic(')) {
      feedback.warnings.push('Avoid using panic() in production code. Use error handling instead.');
    }

    // Best practices
    if (!code.includes('//')) {
      feedback.bestPractices.push('Add comments and proper documentation to explain the purpose of functions and complex logic.');
    }

    if (!code.includes('error')) {
      feedback.bestPractices.push('Implement proper error handling using Go\'s error return values.');
    }

    return feedback;
  }

  /**
   * Generic code analysis for unsupported languages
   * @param {string} code - Code in any language
   * @returns {Object} Analysis results
   */
  static analyzeGeneric(code) {
    const feedback = {
      suggestions: [],
      warnings: [],
      performance: [],
      readability: [],
      bestPractices: []
    };

    // General analysis that applies to any language
    if (code.length > 2000) {
      feedback.readability.push('The code is quite long. Consider breaking it into smaller functions or modules for better maintainability.');
    }

    if (!code.includes('//') && !code.includes('/*') && !code.includes("'''") && !code.includes('"""')) {
      feedback.bestPractices.push('Add comments to explain complex logic and improve code maintainability.');
    }

    if ((code.match(/TODO/g) || []).length > 3) {
      feedback.warnings.push('There are multiple TODO comments. Consider addressing these before production deployment.');
    }

    return feedback;
  }
}

module.exports = CodeReviewAI;