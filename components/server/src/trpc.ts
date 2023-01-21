import { type PrismaClient } from "@prisma/client";

export type PrismaClientType = PrismaClient;

export type Context = {
  prisma: PrismaClientType;
};
