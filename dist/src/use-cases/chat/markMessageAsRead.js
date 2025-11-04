"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkMessageAsRead = void 0;
class MarkMessageAsRead {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(messageId) {
        if (!messageId)
            throw new Error("Message ID is required.");
        return await this.chatRepository.markMessageAsRead(messageId);
    }
}
exports.MarkMessageAsRead = MarkMessageAsRead;
