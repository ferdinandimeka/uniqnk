"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllChats = void 0;
class GetAllChats {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute() {
        return await this.chatRepository.getAllChats();
    }
}
exports.GetAllChats = GetAllChats;
