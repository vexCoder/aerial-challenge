import { Message, MessageRepository } from "core";
import { Context } from "../trpc";

export default class PrismaMessageRepository implements MessageRepository {
  constructor(private ctx: Context) {}

  async getAll(page: number, limit: number): Promise<Message[]> {
    this.ctx.prisma.$connect();
    const messages = await this.ctx.prisma.message.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });

    return (messages ?? []).map((v) => new Message(v));
  }

  async insert(message: string, hasImage?: boolean): Promise<Message> {
    this.ctx.prisma.$connect();
    const created = await this.ctx.prisma.message.create({
      data: {
        message,
        hasImage,
      },
    });

    return new Message(created);
  }

  async delete(id: string): Promise<Message | undefined> {
    this.ctx.prisma.$connect();
    const deleted = await this.ctx.prisma.message.delete({
      where: {
        id,
      },
    });

    if (deleted) {
      return new Message(deleted);
    }

    return undefined;
  }
}
