"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIContainer = void 0;
const InMemoryUserRepository_1 = require("./repositories/InMemoryUserRepository");
const getAllUsers_1 = require("../use-cases/user/getAllUsers");
class DIContainer {
    static getUserRepository() {
        return this._userRepository;
    }
    static getGetAllUsersUseCase() {
        return new getAllUsers_1.GetAllUsers(this.getUserRepository());
    }
}
exports.DIContainer = DIContainer;
DIContainer._userRepository = new InMemoryUserRepository_1.InMemoryUserRepository();
