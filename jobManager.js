import path from 'path';
import { fileURLToPath } from 'url';
import { scheduleJob } from 'node-schedule';
import Job from './models/Job.js';
import ApiResponseEntity from './models/ApiResponseEntity.js';
import JobError from './exception/JobError.js';
import utils from './utils/utils.js';
import WorkerFunction from './models/WorkerFunction.js';
import JobQueue from './models/JobQueue.js';
import JobQueueItem from './models/JobQueueItem.js';
import MessageHandler from './models/MessageHandler.js';
import jobQueue from './models/JobQueue.js';
import CronExp from './models/CronExp.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerPath = path.resolve(__dirname, './worker.js');

/** Map of jobId -> Job 
 * @type {Map<number, Job>}
*/
const jobMap = new Map();

/**
 * Create a job (thread or scheduler)
 * @param {Object} props
 * @param {'thread'|'scheduler'} props.type
 * @param {WorkerFunction} props.method
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.parentId]
 * @param {import('./models/CronExp.js').CronExpObj} [props.cronExp] - Only for scheduler
 * @param {MessageHandler} [props.messageHandler] - Optional message handlers for worker thread
 * @throws {JobError} When service not found, parent job not found, or scheduler with same title already running
 * @returns {Promise<string>} jobid
 */
const createJob = async (props) => {
    const { type, title, description, parentId, cronExp } = props;

    if (!props.type || !['thread', 'scheduler'].includes(props.type)) throw new JobError(400, 'Invalid or missing job type');
    const method = new WorkerFunction(props.method);
    const messageHandler = new MessageHandler(props.messageHandler ?? { mainThreadOnMessage: () => {} });

    try {
        const service = await import(method.serviceModule);
        if (!service) throw new JobError(404, 'Service not found');
    } catch (error) {
        console.error(`Error loading service module "${method.serviceModule}":`, error);
        throw new JobError(404, 'Service not found');
    }

    const jobid = Date.now();
    if (parentId && !jobMap.has(parentId)) throw new JobError(404, `Parent job with id ${parentId} not found`);

    if (Array.from(jobMap.values()).some(job => job.title === title && job.type === 'scheduler' && job.status === 202 )) throw new JobError(409, `Scheduler is already running`);

    const job = new Job({
        title,
        type,
        description,
        status: 202,
        parentId,
        response: new ApiResponseEntity({ status: 202, message: 'Job is in Queue' })
    });

    if (type === 'thread') {
        const jobData = new JobQueueItem({ jobid, method, title, job, messageHandler });
        JobQueue.push(jobData); 
        JobQueue.runNextJobFromQueue();
    } else if (type === 'scheduler') {
        if(!cronExp) throw new JobError(409, 'Provide Cron Expression');
        const cronExpString = new CronExp(cronExp).toString();

        job.executor = scheduleJob(cronExpString, async () => {
            try {
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
            }
        });
        job.executor.invoke();
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
const getJob = (jobid) => {
    const job = jobMap.get(jobid);
    if (!job) throw new JobError(404, 'Job not found');
    return job;
};

/** Cancel a job (thread or scheduler)
 * @param {number} jobid - jobid of associated job
 * @throws {JobError} When job not found
 * @returns {ApiResponseEntity} Returns a response
 */
const cancelJob = (jobid) => {
    const job = getJob(jobid);
    let resMsg = '';

    if (job.type === 'thread') {
        if (job.executor) {
            job.executor.terminate();
            resMsg = `Job[${jobid}] Terminated Successfully`;
        } else {
            JobQueue.removeByJobId(jobid);
            resMsg = `Job[${jobid}] removed from queue Successfully`;
        }
    } else if (job.type === 'scheduler') {
        if (job.executor) {
            job.executor.cancel();
            Array.from(jobMap)
                    .filter(([_, childJob]) => childJob.parentId >= 0 && childJob.parentId === jobid)
                    .forEach(([childJobId, childJob]) => {
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
    console.log(resMsg);
    return new ApiResponseEntity({ status: 499, message: resMsg });
};


/** Clear jobs that are not in progress or finished or not in queue */
const clearJobData = () => {
    for (const [jobid, job] of jobMap) {
        if (job.status !== 202 && !JobQueue.hasJobInQueue(jobid)) {
            jobMap.delete(jobid);
        }
    }
    return new ApiResponseEntity({ status: 200, message: 'Cleared job data for all completed/cancelled jobs' });
};

/** Clear job data by jobid
 * @param {number} jobid - Job ID to clear
 * @throws {JobError} - When job not found or job is in-progress or in queue
 */
const clearJobDataByJobId = (jobid) => {
    const job = getJob(jobid);
    if (job.status === 202) throw new JobError(400, 'Cannot clear job data for in-progress jobs');
    if (JobQueue.hasJobInQueue(jobid)) throw new JobError(400, 'Cannot clear job data for jobs in queue. You may cancel the job first.');
    jobMap.delete(jobid);
    return new ApiResponseEntity({ status: 200, message: `Job data for jobid ${jobid} cleared successfully` });
};

/** Get job details 
 * @param {number} jobid - Job id of associate job
 * @throws {JobError} - When job not found
 * @returns {ApiResponseEntity} Returns a response with job detail with it's children
*/
const getJobDetail = (jobid) => {
    const job = getJob(jobid);

    return new ApiResponseEntity({
        status: 200,
        message: 'Job detail fetched',
        data: {
            jobid,
            type: job.type,
            title: job.title,
            description: job.description,
            status: utils.jobStatusFromCode(job.status),
            children: Array.from(jobMap)
                .filter(([_, childJob]) => childJob.parentId >= 0 && childJob.parentId === jobid)
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
    });
};

/** Get all active jobs 
 * @returns {ApiResponseEntity} Returns a response with all jobs details with it's children
*/
const getAllJobsDetail = () => {
    const jobs = Array.from(jobMap.entries()).filter(([id, job])=>!job.parentId).map(([id, job]) => ({
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
