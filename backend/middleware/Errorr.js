const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error zdxcdxcvxdcf";

  res.status(err.statusCode).json({
    success: false,
    msg: err.message,
    stack: err.stack,
  });
  next();
};

export default errorHandler;
