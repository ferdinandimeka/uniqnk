import { AuthRepository } from "../../domain/interfaces/authRepository";

export class SignUpUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(fullName: string, username: string, email: string, phone: string, password: string) {
        return await this.authRepository.signUp(fullName, username, email, phone, password);
    }
}
