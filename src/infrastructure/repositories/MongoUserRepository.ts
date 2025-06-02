// import { User } from "../../domain/entities/User";
// import { UserRepository } from "../../domain/interfaces/userRepository";
// import { UserModel } from "../models/UserModel";

// export class MongoUserRepository implements UserRepository {
//     async findAll(): Promise<User[]> {
//         return await UserModel.find();
//     }

//     async findById(id: string): Promise<User | null> {
//         return await UserModel.findById(id);
//     }

//     async create(user: User): Promise<User> {
//         const newUser = new UserModel(user)
//         await newUser.save();
//         return newUser;
//     }

//     async update(user: User): Promise<void> {
//         await UserModel.findByIdAndUpdate(user.id, user)
//     }

//     async delete(id: string): Promise<void> {
//         await UserModel.findByIdAndDelete(id);
//     }
// }

import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { UserModel } from "../models/UserModel";
import mongoose from "mongoose"

export class MongoUserRepository implements UserRepository {
    async findAll(): Promise<User[]> {
        const users = await UserModel.find();
        return users.map(user => this.toUser(user));
    }

    async findById(id: string): Promise<User | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid user ID format');
        }
        const user = await UserModel.findById(id);
        return user ? this.toUser(user) : null;
    }

    async create(user: User): Promise<User> {
        const newUser = new UserModel(user);
        const savedUser = await newUser.save();
        return this.toUser(savedUser);
    }

    async update(user: User): Promise<void> {
        await UserModel.findByIdAndUpdate(user.id, user);
    }

    async delete(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id);
    }

    private toUser(userDoc: any): User {
        const userObj = userDoc.toObject();
        return {
            ...userObj,
            id: userObj._id.toString(), // map MongoDB _id to your domain id
        };
    }
}
