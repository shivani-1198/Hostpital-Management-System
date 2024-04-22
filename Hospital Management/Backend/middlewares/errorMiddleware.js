//

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    //super means that the message is already defined in the error class
    super(message);
    this.statusCode = statusCode;
  }
}

//starting the middleware
export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  //taking in consieration all type of errors

  // Error1:
  //11000 - It comes from the database , it occurs when the same value is occured. For example to keep all the emails unique.
  if (err.code === 11000) {
    // in the msg {Object.keys(err.keyValue)} =we need to get the key value inside the error
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`,
      err = new ErrorHandler(message, 400);
  }

  // Error2:
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    err = new ErrorHandler(message, 400);
  }
  // Error3:
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    err = new ErrorHandler(message, 400);
  }

  // Error4: This occurs when enter our data in a wrong way.
  // eg: a. data type does not match
  // b. validation error
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`,
      err = new ErrorHandler(message, 400);
  }

  // We don't need the full message we only need the precise message stating the error
  //Ex: the phne number must contain 11 digits

  // ? - this will check if the error exists that it will only retunr the value of the objects of the error.

  // : - if  no err.errors does not exits  that it will returnt the original err msg.
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  // return the output
  return res.status(err.statusCode).json({
    success: false,
    //   message: err.message,
    message: errorMessage,
  });
};

export default ErrorHandler;
