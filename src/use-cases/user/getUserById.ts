import { UserRepository } from "../../domain/interfaces/userRepository";

export class GetUserById {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: string) {
        return await this.userRepository.findById(userId);
    }
}