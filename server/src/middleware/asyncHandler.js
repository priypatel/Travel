/**
 * Wraps an async controller function to automatically catch errors
 * and forward them to Express error-handling middleware.
 * Eliminates the need for try/catch in every controller.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
