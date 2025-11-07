import { UserRepository } from "../../domain/interfaces/userRepository";

export class FollowUser {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: string, targetUserId: string): Promise<void> {
        await this.userRepository.follow(userId, targetUserId);
    }
}