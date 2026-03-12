import AppError from '../utils/AppError.js';

/**
 * Middleware factory that validates req.body against a Yup schema.
 * Returns 400 with field-level error details on validation failure.
 *
 * Usage in routes:
 *   router.post('/register', validate(registerSchema), register);
 */
const validate = (schema) => async (req, res, next) => {
  try {
    // abortEarly: false → collect ALL validation errors, not just the first
    const validatedBody = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    req.body = validatedBody; // replace with cleaned/cast values
    next();
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = err.inner.map((e) => ({
        field: e.path,
        message: e.message,
      }));

      const appError = new AppError('Validation failed', 400);
      appError.errors = errors;
      return next(appError);
    }
    next(err);
  }
};

export default validate;
