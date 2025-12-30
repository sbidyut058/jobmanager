/** Get job by id
 * @param {number} jobid - jobid of associated job
 * @throws {JobError} When job not found
 * @returns {Job} Returns the job
 */
export function getJob(jobid: number): Job;
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
export function createJob(props: {
    type: "thread" | "scheduler";
    method: WorkerFunction;
    title: string;
    description?: string | undefined;
    parentId?: string | undefined;
    cronExp?: import("./models/CronExp.js").CronExpObj | undefined;
    messageHandler?: MessageHandler | undefined;
}): Promise<string>;
/** Cancel a job (thread or scheduler)
 * @param {number} jobid - jobid of associated job
 * @throws {JobError} When job not found
 * @returns {ApiResponseEntity} Returns a response
 */
export function cancelJob(jobid: number): ApiResponseEntity;
/** Get job details
 * @param {number} jobid - Job id of associate job
 * @throws {JobError} - When job not found
 * @returns {ApiResponseEntity} Returns a response with job detail with it's children
*/
export function getJobDetail(jobid: number): ApiResponseEntity;
/** Get all active jobs
 * @returns {ApiResponseEntity} Returns a response with all jobs details with it's children
*/
export function getAllJobsDetail(): ApiResponseEntity;
/** Get job response
 * @param {number} jobid - Job id of associate job
 * @returns {ApiResponseEntity|null} response - job Response
*/
export function getJobResponse(jobid: number): ApiResponseEntity | null;
/** Get job main thread postMessage function
 * @param {number} jobid - Job id of associate job
 * @returns {Function|null} postMessage function or null if not a thread job or job not found
*/
export function getJobMainThreadPostMessage(jobid: number): Function | null;
/** Clear jobs that are not in progress or finished or not in queue */
export function clearJobData(): ApiResponseEntity;
/** Clear job data by jobid
 * @param {number} jobid - Job ID to clear
 * @throws {JobError} - When job not found or job is in-progress or in queue
 */
export function clearJobDataByJobId(jobid: number): ApiResponseEntity;
import Job from './models/Job.js';
import WorkerFunction from './models/WorkerFunction.js';
import MessageHandler from './models/MessageHandler.js';
import ApiResponseEntity from './models/ApiResponseEntity.js';
