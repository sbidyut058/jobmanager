export default JobController;
/**
 * Controller to handle Job related APIs
 */
declare class JobController {
    /**
     * Get details of a specific job by ID
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     */
    getJob: (req: any, res: any) => Promise<Object>;
    /**
     * Cancel a specific job by ID
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     */
    cancelJob: (req: any, res: any) => Promise<Object>;
    /**
     * Clear job data by jobid
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     */
    clearJobData: (req: any, res: any) => Promise<Object>;
    /**
     * Clear job data for all jobs
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     */
    clearAllJobData: (req: any, res: any) => Promise<Object>;
    /**
     * Get details of all active jobs
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     */
    getAllJobs: (req: any, res: any) => Promise<Object>;
    /**
     * Get the response/result of a specific job by ID
     * @param {import('express').Request} req - Express request object
     * @param {import('express').Response} res - Express response object
     */
    getJobResponse: (req: any, res: any) => Promise<Object>;
}
