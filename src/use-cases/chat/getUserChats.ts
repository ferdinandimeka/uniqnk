import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class GetUserChats {
  constructor(private chatRepository: ChatRepository) {}

  async execute(userId: string) {
    if (!userId) throw new Error("User ID is required.");
    return await this.chatRepository.getUserChats(userId);
  }
}
