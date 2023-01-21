export interface MessageParams {
  id: string;

  message: string;

  hasImage: boolean | null;

  createdAt: Date;

  url?: string;
}

class Message {
  id: string;

  message: string;

  hasImage: boolean | null;

  createdAt: Date;

  url?: string;

  constructor(opts: MessageParams) {
    this.message = opts.message;
    this.hasImage = opts.hasImage;
    this.id = opts.id;
    this.createdAt = opts.createdAt;
    this.url = opts.url;
  }
}

export default Message;
