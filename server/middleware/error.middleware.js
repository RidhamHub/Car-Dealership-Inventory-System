// Runs when no route matched the request.
export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// Last-resort handler so an unexpected error still returns clean JSON.
export const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
};
