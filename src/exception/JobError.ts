/**
 * Represents all job-related errors.
 * @class
 * @extends {Error}
 */
class JobError extends Error {
  public status: number;
  /**
   * Creates a new JobError.
   * @param {number} status - HTTP-like status code of the error.
   * @param {string} [message] - Optional error message.
   */
  constructor(status: number, message: string | undefined = 'Unknown Job Error') {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;
    this.status = status;

    if ('captureStackTrace' in Error) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

export default JobError;
