// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging
    console.error(err.stack);
    
    // Set status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    // Send error response
    res.status(statusCode).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
  };
  
  module.exports = errorHandler;