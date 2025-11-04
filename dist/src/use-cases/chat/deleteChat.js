"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteChat = void 0;
class DeleteChat {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(chatId) {
        if (!chatId)
            throw new Error("Chat ID is required.");
        return await this.chatRepository.deleteChat(chatId);
    }
}
exports.DeleteChat = DeleteChat;
