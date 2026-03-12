import AppError from "../utils/AppError.js";

/**
 * Middleware factory that validates req.body (default) or req.query against a Yup schema.
 * Returns 400 with field-level error details on validation failure.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), register);          // body
 *   router.get('/', validate(querySchema, 'query'), getAll);               // query params
 */
const validate =
  (schema, source = "body") =>
  async (req, _res, next) => {
    // debug instrumentation helps track why certain inputs slip through
    if (process.env.NODE_ENV !== "production") {
      console.log("[validate] source=", source, "payload=", req[source]);
    }
    try {
      const validated = await schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });
      // Express 5 makes req.query a getter-only property — cannot reassign it.
      // Mutate in place instead: clear unknown keys then copy validated values.
      if (source === "query") {
        for (const key of Object.keys(req.query)) delete req.query[key];
        Object.assign(req.query, validated);
      } else {
        req[source] = validated;
      }
      next();
    } catch (err) {
      if (err.name === "ValidationError") {
        // yup sometimes returns a ValidationError with `inner` empty (especially
        // when using oneOf or transform). we still need at least one entry so
        // clients/tests that inspect `errors[0].field` don't blow up.
        let errors;
        if (err.inner && err.inner.length) {
          errors = err.inner.map((e) => ({
            field: e.path,
            message: e.message,
          }));
        } else {
          errors = [
            {
              field: err.path || "value",
              message: err.message,
            },
          ];
        }

        const appError = new AppError("Validation failed", 400);
        appError.errors = errors;
        return next(appError);
      }
      next(err);
    }
  };

export default validate;
