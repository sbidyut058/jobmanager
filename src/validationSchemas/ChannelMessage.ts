import z from "zod";
import { ApiResponseSchema } from "./ApiResponse.js";
import { MESSAGE_TYPES } from "../utils/constants.js";

export const DefaultChannelMessageSchema = z.object({
    jobid: z.number(),
    type: z.enum([MESSAGE_TYPES.DEFAULT]),
    msg: ApiResponseSchema
});

export const OtherChannelMessageSchema = z.object({
    jobid: z.number(),
    type: z.enum([MESSAGE_TYPES.OTHER]),
    msg: z.any().optional()
});

export type OtherChannelMessageType = z.infer<typeof OtherChannelMessageSchema>;

export const ChannelMessageSchema = z.discriminatedUnion("type", [
  DefaultChannelMessageSchema,
  OtherChannelMessageSchema
]);

export type ChannelMessageType = z.infer<typeof ChannelMessageSchema>;