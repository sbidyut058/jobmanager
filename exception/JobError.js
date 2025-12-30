/**
 * Represents all job-related errors.
 * @class
 * @extends {Error}
 */
class JobError extends Error {
  /**
   * Creates a new JobError.
   * @param {number} status - HTTP-like status code of the error.
   * @param {string} [message] - Optional error message.
   */
  constructor(status, message = 'Unknown Job Error') {
    super(message);
    this.name = this.constructor.name; // <— Important: proper class name in stack trace
    this.status = status;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default JobError;
