export default WorkerData;
declare class WorkerData {
    /**
     * @constructor
     * @param {Object} props
     * @param {number} props.jobid unique job ID
     * @param {WorkerFunction} props.method function to execute in worker
     * @param {WorkerFunction} [props.workerOnMessage] optional payload to pass to the worker
     */
    constructor(props: {
        jobid: number;
        method: WorkerFunction;
        workerOnMessage?: WorkerFunction | undefined;
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
     * @type {WorkerFunction}
     */
    workerOnMessage: WorkerFunction;
}
import WorkerFunction from "./WorkerFunction";
