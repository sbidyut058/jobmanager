/**
 * @typedef {Object<string, { type: string, defaultValue?: any, instance?: Function|Function[], validValues?: any[], nullable?: boolean }>} SchemaType
 */

import utils from "../utils/utils.js";

class BaseObject {
  #schema;
  #data = {};

  /**
   * Creates a validated DTO object.
   * @param {Object<string, any>} parameters - Key-value pairs for the object
   * @param {SchemaType} schema - Schema definition for validation
   * @param {boolean} [strict=true] - Whether to enforce strict schema adherence
   */
  constructor(parameters = {}, schema, strict = true) {
    this.#schema = schema;

    for (const [key, rule] of Object.entries(schema)) {
      const value = parameters[key] !== undefined && parameters[key] !== null
        ? !strict ? this.#transformPropertyValues(key,parameters[key]) : parameters[key]
        : rule?.defaultValue ?? null;

      this.#data[key] = this.#validateProperty(key, value);

      // define getter/setter for public access
      Object.defineProperty(this, key, {
        get: () => this.#data[key],
        set: (val) => {
          this.#data[key] = this.#validateProperty(key, val);
        },
        enumerable: true,
        configurable: true,
      });
    }
  }

  /**
   * transform a property value against the schema
   * @param {string} prop
   * @param {any} value
   */
  #transformPropertyValues(prop, value) {
    const rule = this.#schema[prop];
    if (!rule) throw new Error(`Property '${prop}' is not allowed`);

    const { type, instance, validValues, nullable } = typeof rule === "string"
      ? { type: rule, nullable: true }
      : rule;

    const map = {
      'string': String,
      'number': Number,
      'boolean': utils.toBoolean
    }
    return Object.keys(map).includes(type) ? map[type](value) : value;
  }

  /**
   * Validates a property value against the schema
   * @param {string} prop
   * @param {any} value
   */
  #validateProperty(prop, value) {
    const rule = this.#schema[prop];
    if (!rule) throw new Error(`Property '${prop}' is not allowed`);

    const { type, instance, validValues, nullable } = typeof rule === "string"
      ? { type: rule, nullable: true }
      : rule;

    if (value === null) {
      if (!nullable) throw new Error(`'${prop}' cannot be null`);
      return;
    }

    if (!this.#isTypeMatch(value, type)) {
      throw new Error(`Invalid type for '${prop}', expected '${type}', got '${typeof value}'`);
    }

    if (instance) {
      const instances = Array.isArray(instance) ? instance : [instance];
      if (!instances.some(ins => value instanceof ins)) {
        throw new Error(`Invalid instance for '${prop}', expected one of: ${instances.map(i => i.name).join(', ')}`);
      }
    }

    if (validValues && !validValues.includes(value)) {
      throw new Error(`Invalid value for '${prop}', expected one of: ${validValues.join(', ')}`);
    }

    return type.includes('date') && value ? new Date(dateUtils.convertToOffset(new Date(type.endsWith('date') ? String(value).substring(0, 10) : value).toISOString(), '-5:30')) : value;
  }

  /**
   * Checks type match, supports 'any', 'array', and 'date' (valid date string)
   * @param {any} value
   * @param {string} type
   * @returns {boolean}
   */
  #isTypeMatch(value, type) {
    if (type === "any") return true;
    if (type === "array") return Array.isArray(value);
    if (type === "date") return (typeof value === "string" && !isNaN(Date.parse(value))) || value instanceof Date;
    return typeof value === type;
  }
}

export default BaseObject;
