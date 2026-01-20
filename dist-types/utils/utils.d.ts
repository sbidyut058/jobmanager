declare namespace _default {
    export { sleep };
    export { asyncHandler };
    export { toCronExpression };
    export { processResponseEntity };
    export { jobStatusFromCode };
    export { toBoolean };
}
export default _default;
declare function sleep(ms: any): Promise<any>;
declare function asyncHandler(fn: any): (req: any, res: any, next: any) => Promise<any>;
/**
 * Converts a cronExpObj into a cron expression string.
 * @param {import("../jobManager.js").cronExpObj} obj
 * @returns {string} Cron expression string.
 */
declare function toCronExpression(obj: import("../jobManager.js").cronExpObj): string;
/**
 *
 * @param {Object} res - Response object
 * @param {ApiResponseEntity} entity
 * @returns {Object} res - Response object
 */
declare function processResponseEntity(res: Object, entity: ApiResponseEntity): Object;
/**
 * Maps HTTP-like status codes to job status strings.
 * @param {number} code - Status code.
 * @returns {string} Job status string.
 */
declare function jobStatusFromCode(code: number): string;
declare function toBoolean(value: any): boolean;
import ApiResponseEntity from "../models/ApiResponseEntity.js";
