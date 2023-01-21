import { test, expect, beforeAll, afterAll, jest } from "@jest/globals";
import { Message } from "@prisma/client";
import prisma from "../prisma";
import { appRouter, createInnerTRPCContext } from "../server";

const mockOutput: Omit<Message, "id" | "createdAt">[] = [
  {
    hasImage: false,
    message: "test-message",
  },
  {
    hasImage: false,
    message: "test-message-2",
  },
];

beforeAll(async () => {
  jest.setTimeout(60000);

  await prisma.$connect();

  await prisma.message.createMany({
    data: mockOutput,
  });
});

test("list test", async () => {
  const caller = appRouter.createCaller(createInnerTRPCContext({ prisma }));

  const result = await caller.list({ page: 1, limit: 1 });

  expect(result.messages).toHaveLength(1);
  expect(result.hasNext).toBe(true);
});

afterAll(async () => {
  jest.setTimeout(60000);

  await prisma.message.deleteMany({
    where: {
      message: {
        in: mockOutput.map((v) => v.message),
      },
    },
  });

  await prisma.$disconnect();
});
