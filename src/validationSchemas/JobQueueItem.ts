import z from "zod";
import { jobSchema } from "./Job.js";
import { MessageHandlerSchema } from "./MessageHandler.js";
import { WorkerFunctionSchema } from "./WorkerFunction.js";

export const JobQueueItemSchema = z.object({
  jobid: z.number(),
  method: WorkerFunctionSchema,
  title: z.string(),
  job: jobSchema,
  messageHandler: z.union([MessageHandlerSchema, z.null()])
});

export type JobQueueItemType = z.infer<typeof JobQueueItemSchema>;