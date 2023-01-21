import { initTRPC } from "@trpc/server";
import * as dotenv from "dotenv";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
} from "./controller/MessageController";
import { addMessageDTO, deleteMessageDTO, getAllMessagesDTO } from "./dto";
import prisma from "./prisma";
import type { Context } from "./trpc";

dotenv.config();

export const createInnerTRPCContext = (opts: Context) => ({
  prisma: opts.prisma || prisma,
});

const t = initTRPC.context<typeof createInnerTRPCContext>().create();

const { router } = t;
const publicProcedure = t.procedure;

export const appRouter = router({
  list: publicProcedure.input(getAllMessagesDTO).query(getAllMessages),
  add: publicProcedure.input(addMessageDTO).mutation(createMessage),
  delete: publicProcedure.input(deleteMessageDTO).mutation(deleteMessage),
});

export type AppRouter = typeof appRouter;
