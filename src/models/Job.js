import { Worker } from 'worker_threads';
import { Job as ScheduleJob } from 'node-schedule';
import ApiResponseEntity from "./ApiResponseEntity.js";
import BaseObject from './BaseObject.js';

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
class Job extends BaseObject {

  /**
   * @param {JobProps} props
   */
  constructor(props) {
    super(props, {
      type: { type: "string", validValues: ["thread", "scheduler"], nullable: false },
      parentId: { type: "number", nullable: true },
      title: { type: "string", nullable: false },
      description: { type: "string", nullable: true },
      status: { type: "number", nullable: true },
      response: { type: "object", instance: ApiResponseEntity, nullable: true },
      executor: { type: "object", instance: [Worker, ScheduleJob], nullable: true }
    });

    /** @type {"thread" | "scheduler"} */
    this.type;

    /** @type {number | null} */
    this.parentId;

    /** @type {string} */
    this.title;

    /** @type {string | null} */
    this.description;

    /** @type {number | null} */
    this.status;

    /** @type {ApiResponseEntity | null} */
    this.response;

    /** @type {Worker | ScheduleJob | null} */
    this.executor;
  }
}

export default Job;
