import { AppError } from '../utils/AppError.js';

export function validate(schemas) {
  return (request, response, next) => {
    const validated = {};
    const details = [];

    for (const [location, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(request[location]);

      if (result.success) {
        validated[location] = result.data;
        continue;
      }

      for (const issue of result.error.issues) {
        details.push({
          field: issue.path.join('.') || location,
          message: issue.message
        });
      }
    }

    if (details.length > 0) {
      return next(new AppError(400, 'VALIDATION_ERROR', 'One or more fields are invalid.', details));
    }

    request.validated = validated;
    return next();
  };
}
