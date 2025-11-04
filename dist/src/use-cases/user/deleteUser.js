"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteUser = void 0;
class DeleteUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        await this.userRepository.delete(userId);
    }
}
exports.DeleteUser = DeleteUser;
