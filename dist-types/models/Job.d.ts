export default Job;
export type JobType = "thread" | "scheduler";
export type JobProps = {
    /**
     * - Type of job ("thread" or "scheduler")
     */
    type: JobType;
    /**
     * - Optional parent job ID
     */
    parentId?: string | undefined;
    /**
     * - Job title
     */
    title: string;
    /**
     * - Optional description
     */
    description?: string | undefined;
    /**
     * - Job status code
     */
    status?: number | undefined;
    /**
     * - Response object for job result
     */
    response?: ApiResponseEntity | undefined;
    /**
     * - Worker thread or scheduler job
     */
    executor?: Worker | ScheduleJob;
};
/**
 * @typedef {"thread" | "scheduler"} JobType
 */
/**
 * @typedef {Object} JobProps
 * @property {JobType} type - Type of job ("thread" or "scheduler")
 * @property {string} [parentId] - Optional parent job ID
 * @property {string} title - Job title
 * @property {string} [description] - Optional description
 * @property {number} [status] - Job status code
 * @property {ApiResponseEntity} [response] - Response object for job result
 * @property {Worker|ScheduleJob} [executor] - Worker thread or scheduler job
 */
/**
 *
 * @class Represents a generic Job (thread or scheduled job).
 * @extends {BaseObject}
 */
declare class Job extends BaseObject {
    /**
     * @param {JobProps} props
     */
    constructor(props: JobProps);
    /** @type {"thread" | "scheduler"} */
    type: "thread" | "scheduler";
    /** @type {number | null} */
    parentId: number | null;
    /** @type {string} */
    title: string;
    /** @type {string | null} */
    description: string | null;
    /** @type {number | null} */
    status: number | null;
    /** @type {ApiResponseEntity | null} */
    response: ApiResponseEntity | null;
    /** @type {Worker | ScheduleJob | null} */
    executor: Worker | ScheduleJob | null;
}
import ApiResponseEntity from "./ApiResponseEntity.js";
import BaseObject from './BaseObject.js';
