import { MessageRepository } from "../repository/message.repository";
import Message from "../entities/Message";

export default class DeleteMessage {
  private repository: MessageRepository;

  constructor(repository: MessageRepository) {
    this.repository = repository;
  }

  async run(id: string): Promise<Message> {
    const message = await this.repository.delete(id);

    if (message) {
      // delete image from s3 here

      return message;
    }

    throw new Error("Message not found");
  }
}
