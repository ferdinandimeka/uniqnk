import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class CreateChat {
  constructor(private chatRepository: ChatRepository) {}

  async execute(participants: string[]) {
    if (!participants || participants.length < 2) {
      throw new Error("A chat must have at least two participants.");
    }
    return await this.chatRepository.createChat(participants);
  }
}
