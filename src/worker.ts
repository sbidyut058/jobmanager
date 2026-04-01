import { workerData, parentPort, type Transferable } from 'worker_threads';
import JobError from './exception/JobError.js';
import { WorkerDataSchema } from './validationSchemas/WorkerData.js';
import { MESSAGE_TYPES, Status, STATUS_LABEL } from './utils/constants.js';
import type { ChannelMessageType } from './validationSchemas/ChannelMessage.js';

const sendMessage = (msg: ChannelMessageType, transferables?: Transferable[] | undefined) => {
    if (parentPort) {
        if(transferables) {
            parentPort.postMessage(msg, transferables);
            return;
        }
        parentPort.postMessage(msg);
    }
};

/**
 * Worker thread entry point.
 * Executes a method from a service module with provided payload.
 * Sends progress and final response back to parent thread via parentPort.
 */
(async () => {
    const data = WorkerDataSchema.parse(workerData);
    const { jobid, method, workerOnMessage } = data;

    /**
     * Sends an update message to parent thread
     * @param {Record<string, number | string | Date | null>} [data] - Optional progress data
     * @param {string} [type] - Message type
     */
    const sendUpdate = (data?: Record<string, number | string | Date | null>, type?: MESSAGE_TYPES) => {
        let messageType: MESSAGE_TYPES = !type ? MESSAGE_TYPES.DEFAULT : type;
        if (messageType === MESSAGE_TYPES.DEFAULT) {
            sendMessage({
                jobid,
                type: messageType,
                msg: {
                    status: Status.IN_PROGRESS,
                    message: 'Job is in progress',
                    data
                }
            });
        } else {
            sendMessage({
                jobid,
                type: messageType,
                msg: data
            });
        }
    };

    if (workerOnMessage) {
        const service = await import(workerOnMessage.serviceModule);
        if (!service) throw new JobError(404, 'Service Not Found');
        const instance = service.default ? service.default : service;
        const fn = instance[workerOnMessage.name];
        if (!fn) throw new JobError(404, 'Function Not Found');
        parentPort?.on('message', fn.bind(instance));
    }

    try {
        // Import service dynamically
        const service = await import(method.serviceModule);
        if (!service) throw new JobError(404, 'Service Not Found');

        // Get the service instance (default export or named export)
        const instance = service.default ? service.default : service;
        const fn = instance[method.name];
        if (!fn) throw new JobError(404, 'Function Not Found');

        // Send initial progress update
        sendUpdate();

        // Execute the service method
        const response = await fn.call(instance, method.payload, sendUpdate);

        // Handle file response
        if (response && response.constructor && response.constructor.name === 'File') {
            const buffer = Buffer.from(await response.arrayBuffer());
            sendMessage({
                jobid,
                type: MESSAGE_TYPES.DEFAULT,
                msg: {
                    status: 200,
                    message: 'job has Ended',
                    headers: {
                        'Content-Type': response.type,
                        'Content-Disposition': `attachment; filename=${response.name}`
                    },
                    data: buffer
                }
            }, [buffer.buffer]);
        } else {
            sendMessage({
                jobid,
                type: MESSAGE_TYPES.DEFAULT,
                msg: {
                    status: 200,
                    message: 'Job has Ended'
                }
            });
        }
    } catch (err) {
        sendMessage({
            jobid,
            type: MESSAGE_TYPES.DEFAULT,
            msg: {
                status: Status.FAILED,
                message: STATUS_LABEL[Status.FAILED] + ' - ' + (err as Error).message
            }
        });
    } finally {
        parentPort?.close();
        process.exit(0);
    }
})().catch(error => {
    throw new JobError(500, error.message);
});
