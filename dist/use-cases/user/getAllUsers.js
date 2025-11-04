"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllUsers = void 0;
class GetAllUsers {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        return await this.userRepository.findAll();
    }
}
exports.GetAllUsers = GetAllUsers;
