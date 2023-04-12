const httpStatus = require("http-status");
const expressValidation = require("express-validation");
const APIError = require("../errors/api-error");
import vars from "../../config/vars";

/**
 * Error handler. Send stacktrace only during development
 * @public
 */
const handler = (err:any, req:any, res:any, next?:any) => {
  const response = {
    code: err.status,
    message: err.message || httpStatus[err.status],
    errors: err.errors,
    stack: err.stack,
  };

  if (vars.env !== "development") {
    delete response.stack;
  }

  res.status(err.status);
  res.json(response);
};

/**
 * If error is not an instanceOf APIError, convert it.
 * @public
 */
const converter = (err:any, req:any, res:any, next?:any) => {
  let convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new APIError({
      message: "Validation Error",
      errors: err.errors,
      status: err.status,
      stack: err.stack,
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      message: err.message,
      status: err.status,
      stack: err.stack,
    });
  }

  return handler(convertedError, req, res);
};

/**
 * Catch 404 and forward to error handler
 * @public
 */
const notFound = (req:any, res:any, next?:any) => {
  const err = new APIError({
    message: "Not found",
    status: httpStatus.NOT_FOUND,
  });
  return handler(err, req, res);
};


export {
  notFound,
  converter,
  handler
}