import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class SendMessage {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    chatId,
    sender,
    receiver,
    text,
    mediaUrls,
  }: {
    chatId: string;
    sender: string;
    receiver: string;
    text?: string;
    mediaUrls?: string[];
  }) {
    if (!chatId || !sender) throw new Error("chatId and sender are required.");
    if (!text && (!mediaUrls || mediaUrls.length === 0))
      throw new Error("Message must contain either text or media.");

    return await this.chatRepository.sendMessage(chatId, sender, receiver,  text, mediaUrls);
  }
}
