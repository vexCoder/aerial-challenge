import Message from "../entities/Message";

export interface MessageRepository {
  getAll(page: number, limit: number): Promise<Message[]>;

  insert(message: string, hasImage: boolean): Promise<Message>;

  delete(id: string): Promise<Message | undefined>;
}
