import z from "zod";
import { ApiResponseSchema } from "./ApiResponse.js";
import { Job } from "node-schedule";
import { MessageHandlerSchema } from "./MessageHandler.js";
import { WorkerFunctionSchema } from "./WorkerFunction.js";
import { CronExpSchema } from "./CronExp.js";
import { JOB_TYPES, Status } from "../utils/constants.js";
import { Worker } from 'worker_threads';

// Common fields
const baseSchema = {
  parentId: z.number().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(Status).default(Status.IN_QUEUE),
  response: ApiResponseSchema
};

// Thread job
export const threadSchema = z.object({
  ...baseSchema,
  type: z.literal(JOB_TYPES.THREAD),
  executor: z.instanceof(Worker).optional().nullable()
});

export type ThreadJobType = z.infer<typeof threadSchema>;

// Scheduler job
export const schedulerSchema = z.object({
  ...baseSchema,
  type: z.literal(JOB_TYPES.SCHEDULER),
  executor: z.instanceof(Job).optional().nullable(),
});

export type SchedulerJobType = z.infer<typeof schedulerSchema>;

export const jobSchema = z.discriminatedUnion("type", [
  threadSchema,
  schedulerSchema
]);

export type JobType = z.infer<typeof jobSchema>;

export const ReqCreateJobSchema = z.object({
  type: z.enum(JOB_TYPES),
  title: z.string(),
  description: z.string().optional().nullable().default(null),
  parentId: z.number().optional().nullable().default(null),
  method: WorkerFunctionSchema,
  cronExp: CronExpSchema.optional(),
  messageHandler: MessageHandlerSchema.optional()
});

export type ReqCreateJobType = z.infer<typeof ReqCreateJobSchema>;