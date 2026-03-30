import utils from "../utils/utils.js";
import { type Request, type Response } from "express";
import { cancelJob, getAllJobsDetail, getJobDetail, getJobResponse as fetchJobResponse, clearJobDataByJobId, clearJobData } from "../jobManager.js";

/**
 * Controller to handle Job related APIs
 */
class JobController {

    /**
     * Get details of a specific job by ID
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    getJob = async (req: Request, res: Response) => {
        const { jobid } = req.query;
        return utils.processResponseEntity(res, getJobDetail(Number(jobid)));
    }

    /**
     * Cancel a specific job by ID
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    cancelJob = async (req: Request, res: Response) => {
        const { jobid } = req.query;
        return utils.processResponseEntity(res, cancelJob(Number(jobid)));
    }

    /**
     * Clear job data by jobid
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    clearJobData = async (req: Request, res: Response) => {
        const { jobid } = req.query;
        return utils.processResponseEntity(res, clearJobDataByJobId(Number(jobid)));
    }

    /**
     * Clear job data for all jobs
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    clearAllJobData = async (req: Request, res: Response) => {
        return utils.processResponseEntity(res, clearJobData());
    }

    /**
     * Get details of all active jobs
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    getAllJobs = async (req: Request, res: Response) => {
        return utils.processResponseEntity(res, getAllJobsDetail());
    }

    /**
     * Get the response/result of a specific job by ID
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     */
    getJobResponse = async (req: Request, res: Response) => {
        const { jobid } = req.query;
        return utils.processResponseEntity(res, fetchJobResponse(Number(jobid)));
    }

}

export default JobController;
