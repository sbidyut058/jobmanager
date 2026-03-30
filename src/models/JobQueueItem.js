import BaseObject from "./BaseObject.js";
import Job from "./Job.js";
import MessageHandler from "./MessageHandler.js";
import WorkerFunction from "./WorkerFunction.js";

class JobQueueItem extends BaseObject {
    /**
     * @param {Object} props
     * @param {number} props.jobid unique job ID
     * @param {WorkerFunction} props.method function to execute in worker
     * @param {string} props.title job title
     * @param {Job} props.job Perticular Job instance
     * @param {MessageHandler} [props.messageHandler] optional function to handle messages from worker
     */
    constructor(props) {
        super(props, {
            jobid: { type: "number", nullable: false },
            method: { type: "object", instance: WorkerFunction, nullable: false }, // WorkerFunction
            title: { type: "string", nullable: false },
            job: { type: "object", instance: Job, nullable: false }, // Job
            messageHandler: { type: "object", instance: MessageHandler, nullable: true } // MessageHandler
        });

        /**
         * @type {number}
         */
        /* Unique job ID */
        this.jobid;

        /**
         * @type {WorkerFunction}
         */
        /* Function to execute in worker */
        this.method;

        /**
         * @type {string}
         */
        this.title;

        /**
         * @type {Job}
         */
        /* Associated Job instance */
        this.job;

        /**
         * @type {MessageHandler}
         */
        /* Optional function to handle messages from worker */
        this.messageHandler;
    }
}

export default JobQueueItem;