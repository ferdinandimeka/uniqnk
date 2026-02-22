import { AuthRepository } from "../../domain/interfaces/authRepository";
import { ApiError } from "../../utils/apiError";
import { UserModel } from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class MongoAuthRepository implements AuthRepository {
   async signIn(
    email: string,
    password: string
): Promise<{ user: any; token: string }> {

    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found, sign up to continue");
    }

    // 🔒 Account state checks
    if (!user.canLogin()) {
        if (user.settings.accountStatus.isDisabled) {
            throw new ApiError(
                403,
                "Your account has been disabled. Please contact support."
            );
        }

        if (user.settings.accountStatus.isDeactivated) {
            throw new ApiError(
                403,
                "Your account is deactivated. Reactivate to continue."
            );
        }

        throw new ApiError(403, "Account is not active");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new ApiError(400, "Wrong credentials");
    }

    const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    return { user, token };
}


    async signUp(fullName: string, username: string, email: string, phone: string, password: string): Promise<void> {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new ApiError(400, "User already exists");
        }

        // const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ fullName, username, phone, email, password });
        await newUser.save({ validateBeforeSave: false });
    }

    async verifyPassword(email: string, password: string): Promise<boolean> {
        const user = await UserModel.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch;
    }
}
