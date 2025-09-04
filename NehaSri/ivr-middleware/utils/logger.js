// Basic error handler & logger
exports.errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
};
