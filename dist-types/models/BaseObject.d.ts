export default BaseObject;
export type SchemaType = {
    [x: string]: {
        type: string;
        defaultValue?: any;
        instance?: Function | Function[];
        validValues?: any[];
        nullable?: boolean;
    };
};
declare class BaseObject {
    /**
     * Creates a validated DTO object.
     * @param {Object<string, any>} parameters - Key-value pairs for the object
     * @param {SchemaType} schema - Schema definition for validation
     * @param {boolean} [strict=true] - Whether to enforce strict schema adherence
     */
    constructor(parameters: {
        [x: string]: any;
    }, schema: SchemaType, strict?: boolean);
    #private;
}
