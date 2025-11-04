import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class DeleteChatMessage {
  constructor(private chatRepository: ChatRepository) {}

  async execute(chatId: string, messageId: string) {
    if (!chatId) throw new Error("Chat ID is required.");
    if (!messageId) throw new Error("Message ID is required.");
    return await this.chatRepository.deleteMessage(chatId, messageId);
  }
}
