import { ChatRepository } from "../../domain/interfaces/chatRepository";

export class GetAllChats {
    constructor(private chatRepository: ChatRepository) {}

    async execute() {
        return await this.chatRepository.getAllChats();
    }
}