import AppError from "../utils/appError.js";

const duplicateKeyHandler = (error) => {
  const value = error.errorResponse.errmsg.match(/(["'])(\\?.)*\1/)[0];
  const msg = `Duplicate field value: ${value}. Please use another value.`;
  return new AppError(msg, 400);
};

const validationErrorHandler = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const msg = `Error: ${errors.join(". ")}`;
  return new AppError(msg, 400);
};

const jwtErrorHandler = (res) =>
  new AppError("Invalid token. Please login again.", 400);

const tokenExpiredHandler = (error, res) =>
  new AppError(`Your token has expired. Please login again.`, 400);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("ERROR: ", err);
    res.status(500).json({
      status: "Error",
      message: "Something went wrong!",
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  if (process.env.NODE_ENV === "production") {
    let error = Object.assign(err);

    if (error?.errorResponse?.code === 11000)
      error = duplicateKeyHandler(error);
    if (error?.name === "ValidationError")
      error = validationErrorHandler(error);
    if (error?.name === "TokenExpiredError") error = tokenExpiredHandler();
    if (error?.name === "JsonWebTokenError") error = jwtErrorHandler();

    sendErrorProd(error, res);
  }
};
