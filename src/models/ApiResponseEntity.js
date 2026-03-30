import BaseObject from "./BaseObject.js";

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
class ApiResponseEntity extends BaseObject {
  
  /**
   * @param {ApiResponseProps} props - API response properties.
   */
  constructor(props) {
    super(props, {
      status: "number",
      message: { type: "string", nullable: true },
      headers: { type: "object", instance: Object, nullable: true },
      data: "any",
    });

    /** @type {number} */
    this.status;

    /** @type {string | null} */
    this.message;

    /** @type {Object | null} */
    this.headers;

    /** @type {any | null} */
    this.data;
  }
}

export default ApiResponseEntity;
