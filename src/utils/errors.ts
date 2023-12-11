export class CustomError extends Error {
  details?: Record<string, string>;
  cause?: Error;

  constructor(message: string, details?: Record<string, string>, cause?: Error) {
    super(message);
    this.name = 'CustomError';

    if (details) {
    this.details = details;
    }

    if (cause) {
      this.cause = cause;
      if (cause.message) {
        this.message += `: ${cause.message}`;
      }
    }
  }
}

export class ParsingError extends CustomError {
  name = 'ParsingError';
}

export class ConfigError extends CustomError {
  name = 'ConfigError';
}

export class ValidationError extends CustomError {
  name = 'ValidationError';
}

export class HttpRequestError extends CustomError {
  name = 'HttpRequestError';
}

export class ServiceError extends CustomError {
  name = 'ServiceError';
}

export class ApiError extends CustomError {
  name = 'ApiError';
}
