import JobError from "./JobError.js";

/* ===========================================
 * Custom error classes (all extend JobError)
 * =========================================== */

/**
 * Schema not found for an object
 */
class TypeSchemaNotFoundError extends JobError {
    constructor(message = "Object Type Schema Not Found") {
        super(404, message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * A property is not present in the schema
 */
class PropertyNotAllowedError extends JobError {
    constructor(property) {
        super(400, `Property '${property}' is not allowed in this schema`);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Invalid primitive/type mismatch
 */
class InvalidTypeError extends JobError {
    constructor(property, expectedType, receivedType) {
        super(422, `Invalid type for '${property}', expected '${expectedType}', got '${receivedType}'`);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Null not allowed for the property
 */
class NullNotAllowedError extends JobError {
    constructor(property) {
        super(422, `Property '${property}' cannot be null`);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Value is not an instance of expected class(es)
 */
class InvalidInstanceError extends JobError {
    constructor(property, expectedNames) {
        super(422, `Invalid instance for '${property}', expected one of: ${expectedNames.join(", ")}`);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Value is not one of allowed values
 */
class InvalidValueError extends JobError {
    constructor(property, allowedValues) {
        super(422, `Invalid value for '${property}', expected one of: ${allowedValues.join(", ")}`);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Schema definition itself is invalid
 */
class InvalidSchemaDefinitionError extends JobError {
    constructor(propertyOrMessage, detail = "") {
        const msg = typeof propertyOrMessage === "string" ? `${propertyOrMessage}${detail ? `: ${detail}` : ""}` : "Invalid schema definition";
        super(500, msg);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Invalid parameters passed to constructor / function
 */
class InvalidParametersError extends JobError {
    constructor(message = "Invalid parameters") {
        super(400, message);
        this.name = this.constructor.name;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Aggregate validation error (collects multiple sub-errors)
 */
class ValidationAggregateError extends JobError {
    /**
     * @param {JobError[]} errors
     */
    constructor(errors = []) {
        super(422, "Validation failed for one or more properties");
        this.name = this.constructor.name;
        this.errors = errors;
        if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    }
}

export {
    TypeSchemaNotFoundError,
    PropertyNotAllowedError,
    InvalidTypeError,
    NullNotAllowedError,
    InvalidInstanceError,
    InvalidValueError,
    InvalidSchemaDefinitionError,
    InvalidParametersError,
    ValidationAggregateError
}