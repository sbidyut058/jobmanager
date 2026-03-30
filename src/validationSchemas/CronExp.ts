import z from "zod";

/**
 * Zod schema for Cron fields
 */
const cronFieldSchemas = {
  second: z
    .string()
    .regex(/^(\*(\/[1-9]\d?)?|([0-5]?\d)(-[0-5]?\d)?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([0-5]?\d)(-[0-5]?\d)?(\/[1-9]\d?)?))*$/)
    .optional(),

  minute: z
    .string()
    .regex(/^(\*(\/[1-9]\d?)?|([0-5]?\d)(-[0-5]?\d)?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([0-5]?\d)(-[0-5]?\d)?(\/[1-9]\d?)?))*$/)
    .optional(),

  hour: z
    .string()
    .regex(/^(\*(\/[1-9]\d?)?|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([01]?\d|2[0-3])(-([01]?\d|2[0-3]))?(\/[1-9]\d?)?))*$/)
    .optional(),

  dayOfMonth: z
    .string()
    .regex(/^(\*(\/[1-9]\d?)?|([1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([1-9]|[12]\d|3[01])(-([1-9]|[12]\d|3[01]))?(\/[1-9]\d?)?))*$/)
    .optional(),

  month: z
    .string()
    .regex(/^(\*(\/[1-9]\d?)?|([1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|([1-9]|1[0-2])(-([1-9]|1[0-2]))?(\/[1-9]\d?)?))*$/)
    .optional(),

  dayOfWeek: z
    .string()
    .regex(/^(\*(\/[1-9]\d?)?|[0-6](-[0-6])?(\/[1-9]\d?)?)(,(\*(\/[1-9]\d?)?|[0-6](-[0-6])?(\/[1-9]\d?)?))*$/)
    .optional()
};

/**
 * Full Cron schema
 */
export const CronExpSchema = z.object(cronFieldSchemas).transform((data) => ({
  second: data.second ?? "*",
  minute: data.minute ?? "*",
  hour: data.hour ?? "*",
  dayOfMonth: data.dayOfMonth ?? "*",
  month: data.month ?? "*",
  dayOfWeek: data.dayOfWeek ?? "*"
}));

export type CronExpType = z.infer<typeof CronExpSchema>;

export const CronExp = (cronExp: CronExpType) => {
  return {
    ...cronExp,
    toString: function() {
      const { second, minute, hour, dayOfMonth, month, dayOfWeek } = this;
      return `${second} ${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
    }
  };
};