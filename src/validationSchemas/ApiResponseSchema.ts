import z from "zod";

export const ApiResponseSchema = z.object({ 
  status: z.number(),
  message: z.string().optional(),
  data: z.any().optional(),
  headers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional()
});

export type ApiResponseType = z.infer<typeof ApiResponseSchema>;