import z from "zod";
import { Status } from "../utils/constants.js";

export const ApiResponseSchema = z.object({ 
  status: z.enum(Status),
  message: z.string().optional(),
  data: z.any().optional(),
  headers: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional()
});

export type ApiResponseType = z.infer<typeof ApiResponseSchema>;