import { workerData, parentPort } from 'worker_threads';
import JobError from './exception/JobError.js';
import ApiResponseEntity from './models/ApiResponseEntity.js';
import WorkerFunction from './models/WorkerFunction.js';

/**
 * Worker thread entry point.
 * Executes a method from a service module with provided payload.
 * Sends progress and final response back to parent thread via parentPort.
 */
(async () => {
    if (!workerData) throw new JobError(400, 'Missing worker data');


    const parser = (json) => {
        return json ? JSON.parse(json,
            (key, value) =>
                typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)
                    ? new Date(value)
                    : value
        ): null
    }

    /** @type {number} */
    const jobid = workerData.jobid;
    /** @type {WorkerFunction} */
    const method = parser(workerData.method);
    /** @type {WorkerFunction|null} */
    let workerOnMessage = parser(workerData.workerOnMessage);

    /**
     * Sends an update message to parent thread
     * @param {any} [data] - Optional progress data
     * @param {string} [type] - Message type
     */
    const sendUpdate = (data, type) => {
        if (type && type !== 'default') {
            parentPort.postMessage(JSON.parse(JSON.stringify({
                jobid,
                type,
                msg: data
            })));
            return;
        } else {
            parentPort.postMessage(JSON.parse(JSON.stringify({
                jobid,
                type: 'default',
                msg: new ApiResponseEntity({
                    status: 202,
                    message: 'Job is in progress',
                    data
                })
            })));
        }
    };

    if (workerOnMessage) {
        const service = await import(workerOnMessage.serviceModule);
        if (!service) throw new JobError(404, 'Service Not Found');
        const instance = service.default ? service.default : service;
        const fn = instance[workerOnMessage.method];
        if (!fn) throw new JobError(404, 'Function Not Found');
        onMessage = fn.bind(instance);
        parentPort.on('message', onMessage);
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
            parentPort.postMessage({
                jobid,
                type: 'default',
                msg: {
                    status: 200,
                    message: 'job has Ended',
                    headers: {
                        'Content-Type': response.type,
                        'Content-Disposition': `attachment; filename=${response.name}`
                    },
                    data: buffer
                }
            }, [buffer.buffer]); // Transfer buffer for performance
        } else {
            parentPort.postMessage(JSON.parse(JSON.stringify({
                jobid,
                type: 'default',
                msg: {
                    status: 200,
                    message: 'Job has Ended'
                }
            })));
        }
    } catch (err) {
        parentPort.postMessage(JSON.parse(JSON.stringify({
            jobid,
            type: 'default',
            msg: new ApiResponseEntity({
                status: 500,
                message: err.message
            })
        })));
    }
})().catch(error => {
    throw new JobError(500, error.message);
});
