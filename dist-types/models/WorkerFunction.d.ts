export default WorkerFunction;
/**
 *
 * @class Represents Function destination to execute in worker.
 * @extends {BaseObject}
 */
declare class WorkerFunction extends BaseObject {
    /**
     * @param {Object} props
     */
    constructor(props: Object);
    /**
     * @type {string}
     */
    serviceModule: string;
    /**
     * @type {string}
     */
    name: string;
    /**
     * @type {object}
     */
    payload: object;
}
import BaseObject from "./BaseObject.js";
