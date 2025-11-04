"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = void 0;
class LoginUser {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }
    async execute(email, password) {
        // Call the signIn method with credentials
        const result = await this.authRepository.signIn(email, password);
        return result;
    }
}
exports.LoginUser = LoginUser;
