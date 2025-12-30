/**
 * Schema not found for an object
 */
export class TypeSchemaNotFoundError extends JobError {
    constructor(message?: string);
}
/**
 * A property is not present in the schema
 */
export class PropertyNotAllowedError extends JobError {
    constructor(property: any);
}
/**
 * Invalid primitive/type mismatch
 */
export class InvalidTypeError extends JobError {
    constructor(property: any, expectedType: any, receivedType: any);
}
/**
 * Null not allowed for the property
 */
export class NullNotAllowedError extends JobError {
    constructor(property: any);
}
/**
 * Value is not an instance of expected class(es)
 */
export class InvalidInstanceError extends JobError {
    constructor(property: any, expectedNames: any);
}
/**
 * Value is not one of allowed values
 */
export class InvalidValueError extends JobError {
    constructor(property: any, allowedValues: any);
}
/**
 * Schema definition itself is invalid
 */
export class InvalidSchemaDefinitionError extends JobError {
    constructor(propertyOrMessage: any, detail?: string);
}
/**
 * Invalid parameters passed to constructor / function
 */
export class InvalidParametersError extends JobError {
    constructor(message?: string);
}
/**
 * Aggregate validation error (collects multiple sub-errors)
 */
export class ValidationAggregateError extends JobError {
    /**
     * @param {JobError[]} errors
     */
    constructor(errors?: JobError[]);
    errors: JobError[];
}
import JobError from "./JobError.js";
