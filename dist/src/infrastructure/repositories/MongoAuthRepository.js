"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoAuthRepository = void 0;
const apiError_1 = require("../../utils/apiError");
const UserModel_1 = require("../models/UserModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class MongoAuthRepository {
    async signIn(email, password) {
        const user = await UserModel_1.UserModel.findOne({ email });
        if (!user) {
            if (!user)
                throw new apiError_1.ApiError(404, "User not found, sign up to continue");
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            throw new apiError_1.ApiError(400, "Wrong credentials");
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return { user, token };
    }
    async signUp(fullName, username, email, phone, password) {
        const existingUser = await UserModel_1.UserModel.findOne({ email });
        if (existingUser) {
            throw new apiError_1.ApiError(400, "User already exists");
        }
        // const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel_1.UserModel({ fullName, username, phone, email, password });
        await newUser.save();
    }
}
exports.MongoAuthRepository = MongoAuthRepository;
