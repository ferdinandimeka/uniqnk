import { User } from "../../domain/entities/User"
import { UserRepository } from "../../domain/interfaces/userRepository"

export class InMemoryUserRepository implements UserRepository {
    private users: User[] = [];

    async findAll(): Promise<User[]> {
        return this.users
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) || null
    }

    async create(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async update(user: User): Promise<void> {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
    }
    async delete(id: string): Promise<void> {
        this.users = this.users.filter(user => user.id !== id);
    }
}