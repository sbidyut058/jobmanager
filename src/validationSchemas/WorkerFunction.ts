import z from "zod";

export const WorkerFunctionSchema = z.object({
  serviceModule: z.string(),
  name: z.string(),
  payload: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).nullable()
});

export type WorkerFunctionType = z.infer<typeof WorkerFunctionSchema>;