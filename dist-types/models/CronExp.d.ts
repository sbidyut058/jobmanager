export default CronExp;
export type CronExpObj = {
    second?: string | undefined;
    minute?: string | undefined;
    hour?: string | undefined;
    dayOfMonth?: string | undefined;
    month?: string | undefined;
    dayOfWeek?: string | undefined;
};
/**
 * @typedef {Object} CronExpObj
 * @property {string} [props.second]
 * @property {string} [props.minute]
 * @property {string} [props.hour]
 * @property {string} [props.dayOfMonth]
 * @property {string} [props.month]
 * @property {string} [props.dayOfWeek]
 */
/** *
 * @class Represents a Cron Expression.
 * @extends {BaseObject}
 */
declare class CronExp extends BaseObject {
    static fromString(cronString: any): CronExp;
    /**
     * @param {CronExpObj} props
     */
    constructor(props: CronExpObj);
    second: any;
    minute: any;
    hour: any;
    dayOfMonth: any;
    month: any;
    dayOfWeek: any;
    #private;
}
import BaseObject from "./BaseObject.js";
