import AppError from '../utils/AppError.js';

/**
 * Middleware factory that validates req.body (default) or req.query against a Yup schema.
 * Returns 400 with field-level error details on validation failure.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), register);          // body
 *   router.get('/', validate(querySchema, 'query'), getAll);               // query params
 */
const validate = (schema, source = 'body') => async (req, _res, next) => {
  try {
    const validated = await schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });
    req[source] = validated;
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
