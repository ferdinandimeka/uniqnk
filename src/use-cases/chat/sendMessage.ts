import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class SendMessage {
  constructor(private chatRepository: ChatRepository) {}

  async execute({
    chatId,
    receiver,
    sender,
    text,
    mediaUrls,
  }: {
    chatId: string;
    receiver: string;
    sender: string;
    text?: string;
    mediaUrls?: string[];
  }) {
    if (!chatId || !sender) throw new Error("chatId and sender are required.");
    if (!text && (!mediaUrls || mediaUrls.length === 0))
      throw new Error("Message must contain either text or media.");

    return await this.chatRepository.sendMessage(chatId, receiver, sender, text, mediaUrls);
  }
}
