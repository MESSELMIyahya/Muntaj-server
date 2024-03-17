// const ApiError = require("../utils/apiError");

const sendErroreForDev = (err, res) => {
  const response = res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    err: err,
    stack: err.stack,
  });
  return response;
};

const sendErroreForProd = (err, res) => {
  const response = res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err.error,
  });
  return response;
};

// const handleJwtInvalidSignature = () => {
//   return new ApiError(`Invalid token plesse login again...`, 401);
// };

// const handleJwtExpired = () => {
//     return new ApiError(`Expired token plesse login again...`, 401);
// };

const globalErrore = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || `error`;
  // eslint-disable-next-line no-self-assign
  err.error = err.error;

  if (process.env.NODE_ENV === `development`) {
    sendErroreForDev(err, res);
  } else {
    // if (err.name === "JsonWebTokenError") {
    //   err = handleJwtInvalidSignature();
    // }
    // if (err.name === "TokenExpiredError") {
    //   err = handleJwtExpired();
    // }

    sendErroreForProd(err, res);
  }
};

module.exports = globalErrore;
