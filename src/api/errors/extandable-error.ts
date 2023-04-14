interface IExtendableError {
  name: string;
  message: string;
  errors?: any;
  status?: number;
  isPublic?: boolean;
  isOperational?: boolean;
  stack?: string;
}

/**
 * @extends Error
 */
class ExtendableError extends Error {
  name: string;
  message: string;
  errors?: any;
  status?: number;
  isPublic?: boolean;
  isOperational?: boolean;
  stack?: string;

  constructor({ message, errors, status, isPublic, stack }: IExtendableError) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.status = status;
    this.isPublic = isPublic;
    this.isOperational = true;
    this.stack = stack;
    // Error.captureStackTrace(this, this.constructor.name);
  }
}

module.exports = ExtendableError;
