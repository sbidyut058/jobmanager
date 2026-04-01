import z from "zod";
import { WorkerFunctionSchema } from "./WorkerFunction.js";

export const WorkerDataSchema = z.object({
  jobid: z.number(),
  method: WorkerFunctionSchema,
  workerOnMessage: z.union([WorkerFunctionSchema, z.null()])
});

export type WorkerData = z.infer<typeof WorkerDataSchema>;