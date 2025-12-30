export default JobQueueItem;
declare class JobQueueItem extends BaseObject {
    /**
     * @param {Object} props
     * @param {number} props.jobid unique job ID
     * @param {WorkerFunction} props.method function to execute in worker
     * @param {string} props.title job title
     * @param {Job} props.job Perticular Job instance
     * @param {MessageHandler} [props.messageHandler] optional function to handle messages from worker
     */
    constructor(props: {
        jobid: number;
        method: WorkerFunction;
        title: string;
        job: Job;
        messageHandler?: MessageHandler | undefined;
    });
    /**
     * @type {number}
     */
    jobid: number;
    /**
     * @type {WorkerFunction}
     */
    method: WorkerFunction;
    /**
     * @type {string}
     */
    title: string;
    /**
     * @type {Job}
     */
    job: Job;
    /**
     * @type {MessageHandler}
     */
    messageHandler: MessageHandler;
}
import BaseObject from "./BaseObject.js";
import WorkerFunction from "./WorkerFunction.js";
import Job from "./Job.js";
import MessageHandler from "./MessageHandler.js";
