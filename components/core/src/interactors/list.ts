import Message from "../entities/Message";
import { MessageRepository } from "../repository/message.repository";

export default class ListMessages {
  private repository: MessageRepository;

  constructor(repository: MessageRepository) {
    this.repository = repository;
  }

  async run(
    page: number,
    limit: number
  ): Promise<{ messages: Message[]; hasNext?: boolean }> {
    const messages = await this.repository.getAll(page, limit);
    const next = await this.repository.getAll(page + 1, limit);

    return {
      messages,
      hasNext: next.length > 0,
    };
  }
}
