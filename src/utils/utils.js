import ApiResponseEntity from "../models/ApiResponseEntity.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * 
 * @param {Object} res - Response object
 * @param {ApiResponseEntity} entity 
 * @returns {Object} res - Response object
 */
const processResponseEntity = (res, entity) => {
    if (entity.headers) {
        Object.keys(entity.headers).forEach(key => {
            res.setHeader(key, entity.headers[key]);
        });
    }

    if (entity.data instanceof Uint8Array && !Buffer.isBuffer(entity.data)) {
        entity.data = Buffer.from(entity.data);
    }

    if (Buffer.isBuffer(entity.data)) {
        res.status(200).send(entity.data);
    } else {
        res.status(200).send({ status: entity.status, message: entity.message, data: entity.data });
    }
    return res;
}

/**
 * Converts a cronExpObj into a cron expression string.
 * @param {import("../jobManager.js").cronExpObj} obj
 * @returns {string} Cron expression string.
 */
function toCronExpression(obj) {
    const { second, minute, hour, dayOfMonth, month, dayOfWeek } = obj;
    return `${minute ?? '*'} ${hour ?? '*'} ${dayOfMonth ?? '*'} ${month ?? '*'} ${dayOfWeek ?? '*'}`;
}

/**
 * Maps HTTP-like status codes to job status strings.
 * @param {number} code - Status code.
 * @returns {string} Job status string.
 */
function jobStatusFromCode(code) {
    const statusMap = {
        200: 'Completed',
        201: 'In Queue',
        202: 'In Progress',
        499: 'Cancelled',
        500: 'Failed'
    };
    return statusMap[code] || 'Unknown';
}

/**
 * 
 * @param {*} value 
 * @returns 
 */
function toBoolean(value) {
    if (value === true) return true;
    if (value === false) return false;

    if (typeof value === 'string') {
        const v = value.trim().toLowerCase();
        if (v === 'true') return true;
        if (v === 'false') return false;
        if (v === '1') return true;
        if (v === '0') return false;
    }

    throw new Error('Invalid boolean value');
}

/**
 * For Payload Transformation of a job before current execution
 * @param {any} payload 
 * @returns {any}
 */
const jobPayloadTransformer = (payload) => {
    return payload && payload instanceof Object ? Object.entries(payload)
    .reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? value() : value;
        return acc;
    }, {}) : payload;
}

export default {
    sleep,
    asyncHandler,
    toCronExpression,
    processResponseEntity,
    jobStatusFromCode,
    toBoolean,
    jobPayloadTransformer
}