import { scheduleJob } from 'node-schedule';
import { type ApiResponseType } from './validationSchemas/ApiResponseSchema.js';
import JobError from './exception/JobError.js';
import utils from './utils/utils.js';
import JobQueue from './JobQueue.js';
import { JobQueueItemSchema } from './validationSchemas/JobQueueItem.js';
import { sendMail } from './config/mail.js';
import { jobSchema, ReqCreateJobSchema, type JobType, type ReqCreateJobType } from './validationSchemas/Job.js';
import { CronExp } from './validationSchemas/CronExp.js';

/** Map of jobId -> Job 
 * @type {Map<number, Job>}
*/
const jobMap: Map<number, JobType> = new Map();

/**
 * Create a job (thread or scheduler)
 * @param {ReqCreateJobType} props
 * @throws {JobError} When service not found, parent job not found, or scheduler with same title already running
 * @returns {Promise<string>} jobid
 */
const createJob = async (props: ReqCreateJobType): Promise<number> => {
    const validatedProps = ReqCreateJobSchema.parse(props);
    const { type, title, description, parentId, cronExp, method } = validatedProps;

    const messageHandler = validatedProps.messageHandler ?? { mainThreadOnMessage: () => { } };

    try {
        const service = await import(method.serviceModule);
        if (!service) throw new JobError(404, 'Service not found');
    } catch (error) {
        console.error(`Error loading service module "${method.serviceModule}":`, error);
        throw new JobError(404, 'Service not found');
    }

    const jobid = Date.now();
    if (parentId && !jobMap.has(parentId)) throw new JobError(404, `Parent job with id ${parentId} not found`);

    if (Array.from(jobMap.values()).some(job => job.title === title && job.type === 'scheduler' && job.status === 202)) throw new JobError(409, `Scheduler is already running`);

    const job = jobSchema.parse({
        title,
        type,
        description,
        status: 201,
        parentId,
        response: { status: 201, message: 'Job is in Queue' }
    });

    if (type === 'thread') {
        const jobData = JobQueueItemSchema.parse({ jobid, method, title, job, messageHandler });
        JobQueue.push(jobData);
        JobQueue.runNextJobFromQueue();
    } else if (type === 'scheduler') {
        if (!cronExp) throw new JobError(409, 'Provide Cron Expression');
        const cronExpString = CronExp(cronExp).toString();

        job.executor = scheduleJob(cronExpString, async () => {
            try {
                const queuedOrActiveJobs = Array.from(jobMap)
                    .filter(([_, childJob]) => childJob.parentId && childJob.parentId >= 0 && childJob.parentId === jobid && (childJob.status === 202 || childJob.status === 201))
                if (queuedOrActiveJobs.length > 0) {
                    console.log(`Scheduler job "${title}" skipped at ${new Date().toISOString()} due to existing queued or active child jobs.`);
                    await sendMail({
                        subject: 'Scheduler Job Skipped',
                        text: `Scheduler job "${title}" skipped at ${new Date().toISOString()} due to existing queued or active child jobs.`
                    }).catch((err: any) => {
                        console.error('Error sending email:', err.message ?? 'Unknown error');
                    });
                    return;
                }
                if (JobQueue.length >= JobQueue.maxQueueItems) {
                    console.log(`Scheduler job "${title}" skipped at ${new Date().toISOString()} due to full job queue.`);
                    await sendMail({
                        subject: 'Scheduler Job Skipped',
                        text: `Scheduler job "${title}" skipped at ${new Date().toISOString()} due to full job queue.`
                    }).catch((err: any) => {
                        console.error('Error sending email:', err.message ?? 'Unknown error');
                    });
                    return;
                }
                console.log(`Scheduler job "${title}" triggered at ${new Date().toISOString()}`);
                await createJob({
                    type: 'thread',
                    title: `Child of scheduled job: ${title}`,
                    description: '',
                    parentId: jobid,
                    method,
                    messageHandler
                });
            } catch (error) {
                console.error(`Scheduler job "${title}" error:`, error);
                cancelJob(jobid);
                await sendMail({
                    subject: 'Scheduler Job Error',
                    text: `Scheduler job "${title}" encountered an error and has been cancelled. Error details: ${(error as Error).message ?? 'Unknown error'}`
                }).catch((err: any) => {
                    console.error('Error sending email:', err.message ?? 'Unknown error');
                });
            }
        });
        job.executor.invoke();
        job.status = 202;
        job.response.status = 202;
        job.response.message = 'Scheduler is Running';
    } else {
        throw new JobError(400, 'Invalid job type');
    }

    jobMap.set(jobid, job);
    return jobid;
};

/** Get job by id
 * @param {number} jobid - jobid of associated job
 * @throws {JobError} When job not found
 * @returns {Job} Returns the job
 */
const getJob = (jobid: number): JobType => {
    const job = jobMap.get(jobid);
    if (!job) throw new JobError(404, 'Job not found');
    return job;
};

/** Cancel a job (thread or scheduler)
 * @param {number} jobid - jobid of associated job
 * @throws {JobError} When job not found
 * @returns {ApiResponseEntity} Returns a response
 */
const cancelJob = (jobid: number): ApiResponseType => {
    const job = getJob(jobid);
    let resMsg = '';

    if (job.type === 'thread') {
        if (job.executor) {
            (job.executor as Worker).terminate();
            resMsg = `Job[${jobid}] Terminated Successfully`;
        } else {
            JobQueue.removeByJobId(jobid);
            resMsg = `Job[${jobid}] removed from queue Successfully`;
        }
    } else {
        if (job.executor) {
            job.executor.cancel();
            const childJobs = Array.from(jobMap)
                .filter(([_, childJob]) => childJob.parentId && childJob.parentId >= 0 && childJob.parentId === jobid);
            const activeJobs = childJobs.filter(([_, childJob]) => childJob.status === 202);
            const queuedJobs = activeJobs.filter(([childJobId, _]) => JobQueue.hasJobInQueue(childJobId));
            [
                ...queuedJobs,
                ...activeJobs
            ].forEach(([childJobId, _]) => {
                cancelJob(childJobId);
            });
            resMsg = `Scheduler Job[${jobid}] Cancelled Successfully`;
        }
    }
    resMsg = resMsg ?? 'Job cancelled successfully';

    job.status = 499;
    job.response.status = 499;
    job.response.message = resMsg;
    job.executor = null;
    return { status: 499, message: resMsg };
};


/** Clear jobs that are not in progress or finished or not in queue */
const clearJobData = (): ApiResponseType => {
    for (const [jobid, job] of jobMap) {
        if (job.status !== 202 && !JobQueue.hasJobInQueue(jobid)) {
            jobMap.delete(jobid);
        }
    }
    return { status: 200, message: 'Cleared job data for all completed/cancelled jobs' };
};

/** Clear job data by jobid
 * @param {number} jobid - Job ID to clear
 * @returns {ApiResponseType} Returns a response with status and message
 * @throws {JobError} - When job not found or job is in-progress or in queue
 */
const clearJobDataByJobId = (jobid: number): ApiResponseType => {
    const job = getJob(jobid);
    if (job.status === 202) throw new JobError(400, 'Cannot clear job data for in-progress jobs');
    if (JobQueue.hasJobInQueue(jobid)) throw new JobError(400, 'Cannot clear job data for jobs in queue. You may cancel the job first.');
    jobMap.delete(jobid);
    return { status: 200, message: `Job data for jobid ${jobid} cleared successfully` };
};

/** Get job details 
 * @param {number} jobid - Job id of associate job
 * @throws {JobError} - When job not found
 * @returns {ApiResponseType} Returns a response with job detail with it's children
*/
const getJobDetail = (jobid: number): ApiResponseType => {
    const job = getJob(jobid);

    return {
        status: 200,
        message: 'Job detail fetched',
        data: {
            jobid,
            type: job.type,
            title: job.title,
            description: job.description,
            status: utils.jobStatusFromCode(job.status),
            children: Array.from(jobMap)
                .filter(([_, childJob]) => childJob.parentId &&childJob.parentId >= 0 && childJob.parentId === jobid)
                .map(([childJobId, childJob]) =>
                ({
                    jobid: childJobId,
                    type: childJob.type,
                    title: childJob.title,
                    description: childJob.description,
                    status: utils.jobStatusFromCode(childJob.status)
                })
                )
        }
    };
};

/** Get all active jobs 
 * @returns {ApiResponseEntity} Returns a response with all jobs details with it's children
*/
const getAllJobsDetail = () => {
    const jobs = Array.from(jobMap.entries()).filter(([id, job]) => !job.parentId).map(([id, job]) => ({
        jobid: id,
        type: job.type,
        title: job.title,
        description: job.description,
        status: utils.jobStatusFromCode(job.status),
        children: Array.from(jobMap)
            .filter(([_, childJob]) => childJob.parentId >= 0 && childJob.parentId === id)
            .map(([childJobId, childJob]) =>
            ({
                jobid: childJobId,
                type: childJob.type,
                title: childJob.title,
                description: childJob.description,
                status: utils.jobStatusFromCode(childJob.status)
            })
            )
    }));

    return new ApiResponseEntity({
        status: 200,
        message: jobs.length ? 'Fetched all jobs details' : 'No jobs are present',
        data: jobs
    });
};

/** Get job response
 * @param {number} jobid - Job id of associate job
 * @returns {ApiResponseEntity|null} response - job Response
*/
const getJobResponse = (jobid) => {
    const job = getJob(jobid);
    return job.response;
}

/** Get job main thread postMessage function
 * @param {number} jobid - Job id of associate job
 * @returns {Function|null} postMessage function or null if not a thread job or job not found
*/
const getJobMainThreadPostMessage = (jobid) => {
    const job = getJob(jobid);
    return job.executor ? job.executor.postMessage : null;
}

export {
    getJob,
    createJob,
    cancelJob,
    getJobDetail,
    getAllJobsDetail,
    getJobResponse,
    getJobMainThreadPostMessage,
    clearJobData,
    clearJobDataByJobId
};
