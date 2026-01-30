import bcrypt from "bcryptjs";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/interfaces/userRepository";
import { UserModel } from "../models/UserModel";
import mongoose, {Types} from "mongoose"
import { handleFailedPinAttempt } from "../../mappers/failedAttempt"

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

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Here you would normally hash the passwords and compare hashes
        if (user.password !== currentPassword) {
            throw new Error("Current password is incorrect");
        }

        user.password = newPassword; // In real applications, hash the new password before saving
        await user.save();
    }

    async setTransactionalPin(userId: string, transactionalPin: string): Promise<void> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        // hash pin before saving
        const PIN_SALT_ROUNDS = 12;
        // hash logic
        const hashPin = (pin: string): Promise<string> => {
            return bcrypt.hash(pin, PIN_SALT_ROUNDS);
        }
        user.transactionalPin = {
            pinHash: await hashPin(transactionalPin),
            pinSet: true,
            pinUpdatedAt: new Date(),
            failedAttempts: 0
        };
        await user.save();
    }

    async verifyTransactionalPin(userId: string, transactionalPin: string): Promise<boolean> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const pinData = user?.transactionalPin;
        if (!pinData?.pinSet) {
            throw new Error("Transactional PIN not set");
        }
        // check lock
        if (pinData.lockedUntil && new Date(pinData.lockedUntil) > new Date()) {
            throw new Error("Transactional PIN is locked. Please try again later.");
        }

        const isMatch = await bcrypt.compare(transactionalPin, pinData.pinHash);
        if (!isMatch) {
            await handleFailedPinAttempt(userId, pinData);
            return false;
        }

        await UserModel.updateOne({ _id: userId }, {
            "transactionalPin.failedAttempts": 0,
            "transactionalPin.lockedUntil": null
        });
        return true;
    }

    private toUser(userDoc: any): User {
        const userObj = userDoc.toObject();
        return {
            ...userObj,
            id: userObj._id.toString(), // map MongoDB _id to your domain id
        };
    }
}
