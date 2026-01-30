import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/entities/User";

export class VerifyTransactionalPin {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: string, transactionalPin: string): Promise<boolean> {
        return await this.userRepository.verifyTransactionalPin(userId, transactionalPin);
    }
}