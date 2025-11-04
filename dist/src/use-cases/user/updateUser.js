"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUser = void 0;
class UpdateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    // async execute(user: User) {
    //     return await this.userRepository.update(user);
    // }
    async execute(userId, userData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const updatedUser = { ...user, ...userData };
        await this.userRepository.update(updatedUser);
        return updatedUser;
    }
}
exports.UpdateUser = UpdateUser;
