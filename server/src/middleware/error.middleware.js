export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Not found: ${req.originalUrl}`));
}

export function errorHandler(err, _req, res, _next) {
  let status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Server error";
  let errors = err.errors;

  // Mongoose validation → 400 with field errors
  if (err.name === "ValidationError") {
    status = 400;
    message = "Validation failed";
    errors = Object.fromEntries(
      Object.entries(err.errors || {}).map(([k, v]) => [k, v.message])
    );
  }
  // Mongoose ObjectId cast → 400
  if (err.name === "CastError" && err.kind === "ObjectId") {
    status = 400;
    message = `Invalid id for field "${err.path}"`;
    errors = { [err.path]: "Invalid identifier" };
  }
  // Duplicate key → 409
  if (err.code === 11000) {
    status = 409;
    message = "Duplicate value";
    errors = err.keyValue;
  }

  res.status(status).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
