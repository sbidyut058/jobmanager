import { Worker } from 'worker_threads';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { getJob } from './jobManager.js';
import type { JobQueueItemType } from './validationSchemas/JobQueueItem.js';
import utils from './utils/utils.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerPath = path.resolve(__dirname, '../worker.js');

/**
 * JobQueue manages a queue of JobQueueItem instances.
 */
class JobQueue {

    /** Max Queue Items
     * @type {number}
     */
    #MAX_QUEUE_ITEMS: number = os.cpus().length * 3;

    /** Queue items
     * @type {Array<JobQueueItem>} 
     */
    #items: Array<JobQueueItemType> = [];

    /** Max workers = number of CPU cores
     * @type {number}
     */
    #MAX_WORKERS: number = os.cpus().length;

    /** Currently running worker count
     * @type {number}
     */
    #activeWorkers: number = 0;

    /** 
     * @returns {number} Number of max queue items
     */
    get maxQueueItems(): number {
        return this.#MAX_QUEUE_ITEMS;
    }

    /**
     * @returns {number} Number of items in the queue
     */
    get length(): number {
        return this.#items.length;
    }

    /**
     * @returns {number} Maximum number of concurrent workers
     */
    get maxWorkers(): number {
        return this.#MAX_WORKERS;
    }

    /**
     * @returns {Array<JobQueueItem>} All items in the queue
     */
    get items(): Array<JobQueueItemType> {
        return this.#items;
    }

    /**
     * Push a new item to the end of the queue
     * @param {JobQueueItem} item 
     */
    push(item: JobQueueItemType) {
        this.#items.push(item);
    }

    /**
     * Remove and return the first item from the queue
     * @returns {JobQueueItem|null} The removed item or null if the queue is empty
     */
    shift(): JobQueueItemType | null {
        const item = this.#items.shift();
        return item ?? null;
    }

    /**
     * Add a new item to the front of the queue
     * @param {JobQueueItem} item 
     */
    unshift(item: JobQueueItemType) {
        this.#items.unshift(item);
    }

    /** Remove item by jobid 
     * @param {number} jobid - Job ID to remove
    */
    removeByJobId(jobid: number) {
        const idx = this.#items.findIndex(item => item.jobid === jobid);
        if (idx > -1) this.#items.splice(idx, 1);
    }

    /** Check if job is in queue
     * @param {number} jobid - Job ID to check
     * @returns {boolean} True if job is in queue, false otherwise
    */
    hasJobInQueue(jobid: number): boolean {
        return this.#items.some(item => item.jobid === jobid);
    }

    /** Run next thread job from queue */
    runNextJobFromQueue = () => {

        while (this.#activeWorkers < this.#MAX_WORKERS && this.#items.length > 0) {
            const nextJob = this.shift();
            if(!nextJob) return;
            this.#activeWorkers++;
    
            const jobid = nextJob.jobid;
            const method = nextJob.method;
            if(method) method.payload = utils.jobPayloadTransformer(method.payload ?? {});
            const title = nextJob.title;
            const mainThreadOnMessage = nextJob.messageHandler?.mainThreadOnMessage;
            const workerOnMessage = nextJob.messageHandler?.workerOnMessage;
            if(workerOnMessage) workerOnMessage.payload = utils.jobPayloadTransformer(workerOnMessage.payload ?? {});
    
            const worker: Worker = new Worker(workerPath, {
                workerData: { jobid, method: method ? JSON.stringify(method) : null, workerOnMessage: workerOnMessage ? JSON.stringify(workerOnMessage) : null }
            });
    
            // Update job data in JobMap
            nextJob.job.executor = worker as any;
            nextJob.job.status = 202;
            if(nextJob.job.response) {
                nextJob.job.response.status = 202;
                nextJob.job.response.message = 'Job is Running';
            }
    
            worker.on('message', (msg) => {
                if(msg.type === 'default') {
                    const job = getJob(msg.jobid);
                    job.status = msg.msg.status;
                    Object.assign(job.response, msg.msg);
                } else {
                    mainThreadOnMessage(msg);
                }
            });
    
            worker.on('error', (error) => { 
                console.error(`Worker Error [${title}]:`, error);
                worker.terminate();
            });

            worker.on('exit', (code) => {
                console.log(`Worker Exit [${title}] Code:`, code);
                this.#activeWorkers = Math.max(0, this.#activeWorkers - 1);
                this.runNextJobFromQueue();
            });
        }

    };

}

const jobQueue = new JobQueue();
export default jobQueue;