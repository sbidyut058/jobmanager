import z from "zod";
import { WorkerFunctionSchema } from "./WorkerFunction.js";

export const MessageHandlerSchema = z.object({
  mainThreadOnMessage: z.function(),
  workerOnMessage: WorkerFunctionSchema.optional()
});

export type MessageHandlerType = z.infer<typeof MessageHandlerSchema>;