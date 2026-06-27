// A custom Error subclass that carries an HTTP status code.
// When thrown anywhere in the app, our errorHandler middleware
// catches it and sends the right HTTP status automatically.

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean; // true = known/expected error, false = bug

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Maintains proper stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
  }

  // Convenience static factories — keeps controllers readable
  static badRequest(message: string) {
    return new ApiError(400, message);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message: string = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message: string = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message: string) {
    return new ApiError(409, message);
  }

  static internal(message: string = "Internal server error") {
    return new ApiError(500, message);
  }
}