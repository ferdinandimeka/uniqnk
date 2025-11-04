"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChat = void 0;
class CreateChat {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(participants) {
        if (!participants || participants.length < 2) {
            throw new Error("A chat must have at least two participants.");
        }
        return await this.chatRepository.createChat(participants);
    }
}
exports.CreateChat = CreateChat;
