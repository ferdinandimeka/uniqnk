"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpUser = void 0;
class SignUpUser {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(fullName, username, email, phone, password) {
        return await this.authRepository.signUp(fullName, username, email, phone, password);
    }
}
exports.SignUpUser = SignUpUser;
