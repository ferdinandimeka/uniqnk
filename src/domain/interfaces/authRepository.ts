import { User } from "../entities/User"

export interface AuthRepository {
    signUp(fullName: string, username: string, email: string, phone: string, password: string): Promise<void>; // Update this as needed
    signIn(email: string, password: string): Promise<{ user: any; token: string }>;
}
