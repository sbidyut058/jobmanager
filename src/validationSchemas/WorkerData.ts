import z from "zod";
import { WorkerFunctionSchema } from "./WorkerFunction.js";

export const WorkerDataSchema = z.object({
  jobid: z.number(),
  method: WorkerFunctionSchema,
  workerOnMessage: WorkerFunctionSchema.nullable()
});

export type WorkerDataType = z.infer<typeof WorkerDataSchema>;