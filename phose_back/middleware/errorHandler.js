export default (err, req, res, next) => {
  console.error("System Error Logged:", err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected database or server error occurred.";

  res.status(statusCode).json({
    success: false,
    error: message
  });
};
