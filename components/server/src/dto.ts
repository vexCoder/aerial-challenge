import { z } from "zod";

export const addMessageDTO = z.object({
  message: z.string(),
  hasImage: z.boolean(),
});

export type AddMessageDTO = z.infer<typeof addMessageDTO>;

export const deleteMessageDTO = z.object({
  id: z.string(),
});

export type DeleteMessageDTO = z.infer<typeof deleteMessageDTO>;

export const getAllMessagesDTO = z.object({
  page: z.number(),
  limit: z.number(),
});

export type GetMessagesDTO = z.infer<typeof getAllMessagesDTO>;
