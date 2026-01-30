import { User } from "../entities/User"

export interface UserRepository {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    create(user: User, userId: string): Promise<User>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    follow(userId: string, targetUserId: string): Promise<void>;
    unfollow(userId: string, targetUserId: string): Promise<void>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    setTransactionalPin(userId: string, transactionalPin: string): Promise<void>;
    verifyTransactionalPin(userId: string, transactionalPin: string): Promise<boolean>;
}