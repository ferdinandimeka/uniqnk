import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/entities/User";

export class CreateUser {
    constructor(private userRepository: UserRepository) {}

    async execute(user: User, userId: string): Promise<User> {
        return await this.userRepository.create(user, userId);
    }
}