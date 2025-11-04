"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessage = void 0;
class SendMessage {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute({ chatId, receiver, sender, text, mediaUrls, }) {
        if (!chatId || !sender)
            throw new Error("chatId and sender are required.");
        if (!text && (!mediaUrls || mediaUrls.length === 0))
            throw new Error("Message must contain either text or media.");
        return await this.chatRepository.sendMessage(chatId, receiver, sender, text, mediaUrls);
    }
}
exports.SendMessage = SendMessage;
