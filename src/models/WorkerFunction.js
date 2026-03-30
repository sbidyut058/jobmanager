import BaseObject from "./BaseObject.js";

/**
 * 
 * @class Represents Function destination to execute in worker.
 * @extends {BaseObject}
 */
class WorkerFunction extends BaseObject {

    /**
     * @param {Object} props
     */
    constructor(props) {
        super(props, {
            serviceModule: { type: "string", nullable: false },
            name: { type: "string", nullable: false },
            payload: { type: "object", nullable: true }
        });

        /**
         * @type {string}
         */
        /* Module path of the service containing the function to execute */
        this.serviceModule = props.serviceModule;

        /**
         * @type {string}
         */
        /* Name of the function to execute within the service module */
        this.name = props.name;

        /**
         * @type {object}
         */
        this.payload = props.payload;
    }
}



export default WorkerFunction;