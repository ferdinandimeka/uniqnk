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
import mongoose, {Types} from "mongoose"

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

    async create(user: User, userId: string): Promise<User> {
        // get the user by userId to check if it exists
        const existingUser = await this.findById(userId);
        if (!existingUser) {
            throw new Error('User not found');
        }
        // proceed to create the new user
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

    async follow(userId: string, targetUserId: string): Promise<void> {
        const user = await UserModel.findById(userId);
        const target = await UserModel.findById(targetUserId);
        console.log("Following user:", userId, "to", targetUserId);

        if (!user || !target) {
            throw new Error("User or target user not found");
        }

        // Prevent self-follow
        if (userId === targetUserId) {
            throw new Error("You cannot follow yourself");
        }

        // Only update if not already following
        if (!user.following.includes(new Types.ObjectId(targetUserId))) {
            user.following.push(new Types.ObjectId(targetUserId));
            await user.save();
        }

        // Only update if not already followed
        if (!target.followers.includes(new Types.ObjectId(userId))) {
            target.followers.push(new Types.ObjectId(userId));
            await target.save();
        }
    }

    async unfollow(userId: string, targetUserId: string): Promise<void> {
        const user = await UserModel.findById(userId);
        const target = await UserModel.findById(targetUserId);

        if (!user || !target) {
            throw new Error("User or target user not found");
        }

        user.following = user.following.filter(id => id.toString() !== targetUserId);
        target.followers = target.followers.filter(id => id.toString() !== userId);

        await user.save();
        await target.save();
    }


    private toUser(userDoc: any): User {
        const userObj = userDoc.toObject();
        return {
            ...userObj,
            id: userObj._id.toString(), // map MongoDB _id to your domain id
        };
    }
}
