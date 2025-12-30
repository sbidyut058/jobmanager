export default MessageHandler;
declare class MessageHandler extends BaseObject {
    /**
     * @constructor
     *
     * @param {Object} props
     * @param {Function} props.mainThreadOnMessage function to handle messages from main thread
     * @param {WorkerFunction} [props.workerOnMessage] optional worker message handler
     */
    constructor(props: {
        mainThreadOnMessage: Function;
        workerOnMessage?: WorkerFunction | undefined;
    });
    /**
     * @type {Function}
     */
    mainThreadOnMessage: Function;
    /**
     * @type {WorkerFunction}
     */
    workerOnMessage: WorkerFunction;
}
import BaseObject from "./BaseObject.js";
import WorkerFunction from "./WorkerFunction.js";
