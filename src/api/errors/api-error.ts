const ExtendableError = require("./extandable-error");
import httpStatus, { HttpStatus } from "http-status";
interface APIErrorInterface {
  message: string;
  errors?: any;
  stack?: string;
  status?: HttpStatus | number;
  isPublic?: boolean;
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   * @param {APIErrorInterface} options - Object containing the properties of the error.
   */
  constructor(options: APIErrorInterface) {
    const {
      message,
      errors,
      stack,
      status = httpStatus.INTERNAL_SERVER_ERROR,
      isPublic = false,
    } = options;
    super({ message, errors, status, isPublic, stack });
  }
}

export default APIError;
