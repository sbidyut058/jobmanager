import z from "zod";
import { ApiResponseSchema } from "./ApiResponseSchema.js";
import { Job } from "node-schedule";
import { MessageHandlerSchema } from "./MessageHandler.js";
import { WorkerFunctionSchema } from "./WorkerFunction.js";
import { CronExpSchema } from "./CronExp.js";
import { Status } from "../utils/constants.js";

// Common fields
const baseSchema = {
  parentId: z.number().nullable(),
  title: z.string(),
  description: z.string().nullable(),
  status: z.enum(Status).default(Status.IN_QUEUE),
  response: ApiResponseSchema
};

// Thread job
const threadSchema = z.object({
  ...baseSchema,
  type: z.literal("thread"),
  executor: z.instanceof(globalThis.Worker).optional().nullable()
});

// Scheduler job
const schedulerSchema = z.object({
  ...baseSchema,
  type: z.literal("scheduler"),
  executor: z.instanceof(Job).optional().nullable(),
});

// Final schema
export const jobSchema = z.discriminatedUnion("type", [
  threadSchema,
  schedulerSchema
]);

export type JobType = z.infer<typeof jobSchema>;

export const ReqCreateJobSchema = z.object({
  type: z.enum(["thread", "scheduler"]),
  title: z.string(),
  description: z.string().optional().nullable().default(null),
  parentId: z.number().optional().nullable().default(null),
  method: WorkerFunctionSchema,
  cronExp: CronExpSchema.optional(),
  messageHandler: MessageHandlerSchema.optional()
});

export type ReqCreateJobType = z.infer<typeof ReqCreateJobSchema>;