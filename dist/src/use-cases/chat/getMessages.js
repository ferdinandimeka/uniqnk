"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMessages = void 0;
class GetMessages {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(chatId) {
        if (!chatId)
            throw new Error("Chat ID is required.");
        return await this.chatRepository.getMessages(chatId);
    }
}
exports.GetMessages = GetMessages;
