import { UserRepository } from "../../domain/interfaces/userRepository";
import { User } from "../../domain/entities/User";

export class UpdateUser {
    constructor(private userRepository: UserRepository) {}

    // async execute(user: User) {
    //     return await this.userRepository.update(user);
    // }

   async execute(userId: string, userData: Partial<User>) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const updatedUser = { ...user, ...userData };
        await this.userRepository.update(updatedUser);
        return updatedUser;
   }
}