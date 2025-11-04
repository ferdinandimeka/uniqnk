"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
class AuthController {
    constructor(loginUser, signUpUser) {
        this.loginUser = loginUser;
        this.signUpUser = signUpUser;
    }
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await this.loginUser.execute(email, password);
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "User logged in successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async signUp(req, res, next) {
        try {
            const { fullName, username, email, phone, password } = req.body;
            const result = await this.signUpUser.execute(fullName, username, email, phone, password);
            res.status(201).json(new apiResponse_1.ApiResponse(201, result, "User signed up successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
