import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class MarkMessageAsRead {
  constructor(private chatRepository: ChatRepository) {}

  async execute(messageId: string) {
    if (!messageId) throw new Error("Message ID is required.");
    return await this.chatRepository.markMessageAsRead(messageId);
  }
}
