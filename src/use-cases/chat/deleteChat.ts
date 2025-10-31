import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class DeleteChat {
  constructor(private chatRepository: ChatRepository) {}

  async execute(chatId: string) {
    if (!chatId) throw new Error("Chat ID is required.");
    return await this.chatRepository.deleteChat(chatId);
  }
}
