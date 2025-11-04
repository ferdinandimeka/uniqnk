"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = void 0;
class CreateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(user, userId) {
        return await this.userRepository.create(user, userId);
    }
}
exports.CreateUser = CreateUser;
