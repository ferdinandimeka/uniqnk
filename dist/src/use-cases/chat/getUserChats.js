"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserChats = void 0;
class GetUserChats {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(userId) {
        if (!userId)
            throw new Error("User ID is required.");
        return await this.chatRepository.getUserChats(userId);
    }
}
exports.GetUserChats = GetUserChats;
