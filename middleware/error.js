const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  const { message, stack, name, code, errors } = err;
  let error = { ...err };
  error.message = message;

  // Log to console for dev
  console.log(`${stack}`.red);

  // Mongoose bad objectId
  if (name === 'CastError') {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate Key
  if (code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (name === `ValidationError`) {
    const message = Object.values(errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  // Finial response
  res.status(error.statusCode || 500).send({
    success: false,
    error: error.message || 'Server Error'
  });
};
module.exports = errorHandler;
