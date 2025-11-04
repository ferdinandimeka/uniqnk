"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteChatMessage = void 0;
class DeleteChatMessage {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(chatId, messageId) {
        if (!chatId)
            throw new Error("Chat ID is required.");
        if (!messageId)
            throw new Error("Message ID is required.");
        return await this.chatRepository.deleteMessage(chatId, messageId);
    }
}
exports.DeleteChatMessage = DeleteChatMessage;
