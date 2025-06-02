import { AuthRepository } from "../../domain/interfaces/authRepository";
import { User } from "../../domain/entities/User";

export class LoginUser {
    constructor(private authRepository: AuthRepository) {}

    async execute(email: string, password: string) {
        // Call the signIn method with credentials
        const result = await this.authRepository.signIn(email, password);

        return result;
    }
}
