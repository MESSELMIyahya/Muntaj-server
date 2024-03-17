// @des This class is responsible aboute operational errore ( errore that is can preidct )
class ApiError extends Error {
  constructor(message, error, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith(4) ? `fail` : `error`;
    this.error = error;
    this.isOperational = true;
  }
};

module.exports = ApiError;