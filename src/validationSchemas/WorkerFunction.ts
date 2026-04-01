import z from "zod";

export const WorkerFunctionSchema = z.object({
  serviceModule: z.string(),
  name: z.string(),
  payload: z.record(z.string(), z.any()).nullable()
});

export type WorkerFunctionType = z.infer<typeof WorkerFunctionSchema>;