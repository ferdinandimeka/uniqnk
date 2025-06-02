import { UserRepository } from "../../domain/interfaces/userRepository";

export class DeleteUser {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: string): Promise<void> {
        await this.userRepository.delete(userId);
    }
}