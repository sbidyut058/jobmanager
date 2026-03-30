import WorkerFunction from "./WorkerFunction";

class WorkerData {
    /**
     * @constructor
     * @param {Object} props
     * @param {number} props.jobid unique job ID
     * @param {WorkerFunction} props.method function to execute in worker
     * @param {WorkerFunction} [props.workerOnMessage] optional payload to pass to the worker
     */
    constructor(props) {
        super(props, {
            jobid: { type: "number", nullable: false },
            method: { type: "object", instance: WorkerFunction, nullable: false }, // WorkerFunction
            workerOnMessage: { type: "object", instance: WorkerFunction, nullable: true } // WorkerFunction
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
         * @type {WorkerFunction}
         */
        /* Optional payload to pass to the worker */
        this.workerOnMessage;
    }
}

export default WorkerData;