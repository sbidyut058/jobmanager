import z from "zod";
import { WorkerFunctionSchema } from "./WorkerFunction.js";
import { ChannelMessageSchema } from "./ChannelMessage.js";

export const MessageHandlerSchema = z.object({
  mainThreadOnMessage: z.function({
    input: [ChannelMessageSchema],
    output: z.void()
  }).optional(),
  workerOnMessage: WorkerFunctionSchema.optional()
});

export type MessageHandlerType = z.infer<typeof MessageHandlerSchema>;