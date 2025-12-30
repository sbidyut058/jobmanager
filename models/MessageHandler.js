import BaseObject from "./BaseObject.js";
import WorkerFunction from "./WorkerFunction.js";

class MessageHandler extends BaseObject {

    /**
     * @constructor
     * 
     * @param {Object} props
     * @param {Function} props.mainThreadOnMessage function to handle messages from main thread
     * @param {WorkerFunction} [props.workerOnMessage] optional worker message handler
     */
    constructor(props) {
        super(props, {
            mainThreadOnMessage: { type: "function", nullable: false },
            workerOnMessage: { type: "object", instance: WorkerFunction, nullable: true }
        });

        /**
         * @type {Function}
         */
        /* Function to handle messages from the main thread */
        this.mainThreadOnMessage;
        
        /**
         * @type {WorkerFunction}
         */
        /* Optional worker message handler */
        this.workerOnMessage;
    }
}

export default MessageHandler;