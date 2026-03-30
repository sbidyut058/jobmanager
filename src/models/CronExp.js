import JobError from "../exception/JobError.js";
import BaseObject from "./BaseObject.js";

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
class CronExp extends BaseObject {

    /**
     * @param {CronExpObj} props
     */
    constructor(props) {
        super(props, {
            second: { type: "string", nullable: true },
            minute: { type: "string", nullable: true },
            hour: { type: "string", nullable: true },
            dayOfMonth: { type: "string", nullable: true },
            month: { type: "string", nullable: true },
            dayOfWeek: { type: "string", nullable: true }
        });

        this.#validate();
        this.second;
        this.minute;
        this.hour;
        this.dayOfMonth;
        this.month;
        this.dayOfWeek;
    }

    static fromString(cronString) {
        const parts = cronString.split(' ');
        if (parts.length !== 6) throw new Error('Invalid cron string');

        const [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts;
        return new CronExp({ second, minute, hour, dayOfMonth, month, dayOfWeek });
    }

    #validate() {
        const cronRegex = {
            second: /^(\*(\/[1-9]\d?)?|([0-5]?\d)(-[0-5]?\d)?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([0-5]?\d)(-[0-5]?\d)?(\/[1-9]\d?)?))*$/,
            minute: /^(\*(\/[1-9]\d?)?|([0-5]?\d)(-[0-5]?\d)?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([0-5]?\d)(-[0-5]?\d)?(\/[1-9]\d?)?))*$/,
            hour: /^(\*(\/[1-9]\d?)?|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/[1-9]\d?)?))*$/,
            dayOfMonth: /^(\*(\/[1-9]\d?)?|([1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/[1-9]\d?)?))*$/,
            month: /^(\*(\/[1-9]\d?)?|([1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/[1-9]\d?)?))*$/,
            dayOfWeek: /^(\*(\/[1-9]\d?)?|[0-6](-[0-6])?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|[0-6](-[0-6])?(\/[1-9]\d?)?))*$/
        };

        this.second = this.second || '*';
        this.minute = this.minute || '*';
        this.hour = this.hour || '*';
        this.dayOfMonth = this.dayOfMonth || '*';
        this.month = this.month || '*';
        this.dayOfWeek = this.dayOfWeek || '*';

        if (!cronRegex.second.test(this.second)) throw new JobError(402, 'Wrong Second Provided');
        if (!cronRegex.minute.test(this.minute)) throw new JobError(402, 'Wrong Minute Provided');
        if (!cronRegex.hour.test(this.hour)) throw new JobError(402, 'Wrong Hour Provided');
        if (!cronRegex.dayOfMonth.test(this.dayOfMonth)) throw new JobError(402, 'Wrong Day Of Month Provided');
        if (!cronRegex.month.test(this.month)) throw new JobError(402, 'Wrong Month Provided');
        if (!cronRegex.dayOfWeek.test(this.dayOfWeek)) throw new JobError(402, 'Wrong DayOfWeek Provided');
    }

    toString() {
        return `${this.second ?? '*'} ${this.minute ?? '*'} ${this.hour ?? '*'} ${this.dayOfMonth ?? '*'} ${this.month ?? '*'} ${this.dayOfWeek ?? '*'}`;
    }

}

export default CronExp;