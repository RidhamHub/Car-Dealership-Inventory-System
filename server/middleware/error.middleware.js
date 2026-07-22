
export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const payload = { message: err.message || "Internal Server Error" };

  if (err.errors) payload.errors = err.errors;

  if (status >= 500) console.error(err);

  res.status(status).json(payload);
};


export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
