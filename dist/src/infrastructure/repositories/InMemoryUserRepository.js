"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryUserRepository = void 0;
class InMemoryUserRepository {
    constructor() {
        this.users = [];
    }
    async findAll() {
        return this.users;
    }
    async findById(id) {
        return this.users.find(user => user.id === id) || null;
    }
    async create(user) {
        this.users.push(user);
        return user;
    }
    async update(user) {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
    }
    async delete(id) {
        this.users = this.users.filter(user => user.id !== id);
    }
}
exports.InMemoryUserRepository = InMemoryUserRepository;
