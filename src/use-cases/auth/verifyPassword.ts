import { AuthRepository } from "../../domain/interfaces/authRepository";

export class VerifyPassword {
    constructor(private authRepository: AuthRepository) {}
    async execute(email: string, password: string): Promise<boolean> {
        return await this.authRepository.verifyPassword(email, password);
    }
}