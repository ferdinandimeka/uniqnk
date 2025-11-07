import { UserRepository } from "../../domain/interfaces/userRepository";

export class UnfollowUser {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: string, targetUserId: string): Promise<void> {
        await this.userRepository.unfollow(userId, targetUserId);
    }
}