export default JobError;
/**
 * Represents all job-related errors.
 * @class
 * @extends {Error}
 */
declare class JobError extends Error {
    /**
     * Creates a new JobError.
     * @param {number} status - HTTP-like status code of the error.
     * @param {string} [message] - Optional error message.
     */
    constructor(status: number, message?: string);
    status: number;
}
