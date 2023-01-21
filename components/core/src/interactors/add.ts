import Message from "../entities/Message";
import { MessageRepository } from "../repository/message.repository";

export default class AddMessage {
  private repository: MessageRepository;

  constructor(repository: MessageRepository) {
    this.repository = repository;
  }

  async run(msg: string, hasImage: boolean): Promise<Message> {
    const message = await this.repository.insert(msg, hasImage);
    return message;
  }
}
