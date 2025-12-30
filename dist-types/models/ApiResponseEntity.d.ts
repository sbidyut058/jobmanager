export default ApiResponseEntity;
export type ApiResponseProps = {
    /**
     * - Status of the response.
     */
    status: number;
    /**
     * - Optional response message.
     */
    message?: string | undefined;
    /**
     * - Optional response headers.
     */
    headers?: Object | undefined;
    /**
     * - Optional response data.
     */
    data?: any;
};
/**
 *
 * @typedef {Object} ApiResponseProps
 * @property {number} status - Status of the response.
 * @property {string} [message] - Optional response message.
 * @property {Object} [headers] - Optional response headers.
 * @property {any} [data] - Optional response data.
 */
/**
 * Represents an API Response.
 * @class
 * @extends {BaseObject}
 */
declare class ApiResponseEntity extends BaseObject {
    /**
     * @param {ApiResponseProps} props - API response properties.
     */
    constructor(props: ApiResponseProps);
    /** @type {number} */
    status: number;
    /** @type {string | null} */
    message: string | null;
    /** @type {Object | null} */
    headers: Object | null;
    /** @type {any | null} */
    data: any | null;
}
import BaseObject from "./BaseObject.js";
