import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/entities/User";

export class ChangePassword {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        await this.userRepository.changePassword(userId, currentPassword, newPassword);
    }
}