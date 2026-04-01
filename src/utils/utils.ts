import { type ApiResponseType } from "../validationSchemas/ApiResponse.js";
import { type Request, type Response, type NextFunction } from "express";
import type { CronExpType } from "../validationSchemas/CronExp.js";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Processes the response entity and sends it back to the client.
 * @param {Response} res - Response object
 * @param {ApiResponseType} entity - The response entity to process
 * @returns {void}
 */
const processResponseEntity = (res: Response, entity: ApiResponseType): void => {

    Object.keys(entity.headers || {}).forEach(key => {
        if(entity.headers?.[key]) res.setHeader(key, entity.headers[key]);
    });

    if (entity.data instanceof Uint8Array && !Buffer.isBuffer(entity.data)) {
        entity.data = Buffer.from(entity.data);
    }

    if (Buffer.isBuffer(entity.data)) {
        res.status(200).send(entity.data);
    } else {
        res.status(200).send({ status: entity.status, message: entity.message, data: entity.data });
    }
}

/**
 * Converts a cronExpObj into a cron expression string.
 * @param {CronExpType} obj
 * @returns {string} Cron expression string.
 */
const toCronExpression = (obj: CronExpType): string => {
    const { second, minute, hour, dayOfMonth, month, dayOfWeek } = obj;
    return `$${second ?? '*'} ${minute ?? '*'} ${hour ?? '*'} ${dayOfMonth ?? '*'} ${month ?? '*'} ${dayOfWeek ?? '*'}`;
}

/**
 * For Payload Transformation of a job before current execution
 * @param {any} payload 
 * @returns {any}
 */
const jobPayloadTransformer = (payload: Record<string, string | number | boolean | Date | null | (() => any)>): Record<string, string | number | boolean | Date | null> => {
    return payload && Object.entries(payload)
    .reduce<Record<string, string | number | boolean | Date | null>>((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? value() : value;
        return acc;
    }, {});
}

export default {
    sleep,
    asyncHandler,
    toCronExpression,
    processResponseEntity,
    jobPayloadTransformer
}