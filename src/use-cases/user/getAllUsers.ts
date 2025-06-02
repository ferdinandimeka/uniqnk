import { UserRepository } from "../../domain/interfaces/userRepository";

export class GetAllUsers {
    constructor(private userRepository: UserRepository) {}

    async execute() {
        return await this.userRepository.findAll();
    }
}