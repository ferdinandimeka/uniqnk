"use strict";
// import { User } from "../../domain/entities/User";
// import { UserRepository } from "../../domain/interfaces/userRepository";
// import { UserModel } from "../models/UserModel";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUserRepository = void 0;
const UserModel_1 = require("../models/UserModel");
const mongoose_1 = __importDefault(require("mongoose"));
class MongoUserRepository {
    async findAll() {
        const users = await UserModel_1.UserModel.find();
        return users.map(user => this.toUser(user));
    }
    async findById(id) {
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID format');
        }
        const user = await UserModel_1.UserModel.findById(id);
        return user ? this.toUser(user) : null;
    }
    async create(user, userId) {
        // get the user by userId to check if it exists
        const existingUser = await this.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }
        // proceed to create the new user
        const newUser = new UserModel_1.UserModel(user);
        const savedUser = await newUser.save();
        return this.toUser(savedUser);
    }
    async update(user) {
        await UserModel_1.UserModel.findByIdAndUpdate(user.id, user);
    }
    async delete(id) {
        await UserModel_1.UserModel.findByIdAndDelete(id);
    }
    toUser(userDoc) {
        const userObj = userDoc.toObject();
        return {
            ...userObj,
            id: userObj._id.toString(), // map MongoDB _id to your domain id
        };
    }
}
exports.MongoUserRepository = MongoUserRepository;
