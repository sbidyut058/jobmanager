export default jobQueue;
declare const jobQueue: JobQueue;
/**
 * JobQueue manages a queue of JobQueueItem instances.
 */
declare class JobQueue {
    /**
     * @returns {number} Number of items in the queue
     */
    get length(): number;
    /**
     * @returns {Array<JobQueueItem>} All items in the queue
     */
    get items(): Array<JobQueueItem>;
    /**
     * Push a new item to the end of the queue
     * @param {JobQueueItem} item
     */
    push(item: JobQueueItem): void;
    /**
     * Remove and return the first item from the queue
     * @returns {JobQueueItem|null} The removed item or null if the queue is empty
     */
    shift(): JobQueueItem | null;
    /**
     * Add a new item to the front of the queue
     * @param {JobQueueItem} item
     */
    unshift(item: JobQueueItem): void;
    /** Remove item by jobid
     * @param {number} jobid - Job ID to remove
    */
    removeByJobId(jobid: number): void;
    /** Check if job is in queue
     * @param {number} jobid - Job ID to check
     * @returns {boolean} True if job is in queue, false otherwise
    */
    hasJobInQueue(jobid: number): boolean;
    /** Run next thread job from queue */
    runNextJobFromQueue: () => void;
    #private;
}
import JobQueueItem from './JobQueueItem.js';
