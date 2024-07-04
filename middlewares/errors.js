const { Mongoose } = require("mongoose");
const ErrorHandler = require("../utils/errrorHandler");

module.exports = (err, req, res, next) => {
  err.statuscode = err.statuscode || 500;
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log(err);

    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };

    error.message = err.message;

    //wrong moogose object ID error
    if (err.name == "castError") {
      const message = ` Resource not found. invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling Mongoose validation error
    if (err.name === "validationError") {
      const message = object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }
  }
  // Handling Mongoose duplicate key errors
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  // Handling wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try Again!!!";
    error = new ErrorHandler(message, 400);
  }
  // Handling Expired JWT error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try Again!!!";
    error = new ErrorHandler(message, 400);
  }

  err.message = err.message || "Inernal Server Error";

  res.status(err.statuscode).json({
    sucess: false,
    message: error.message || "Internal Server Error",
  });
};
