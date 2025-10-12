import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
    fullName: string;
    email: string;
    username: string;
    password: string;
    profilePicture?: string;
    coverPhoto?: string;
    bio?: string;
    marital_status?: string;
    gender?: string;
    phone?: string;
    location?: string;
    website?: string;
    friends: mongoose.Types.ObjectId[];
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    posts: mongoose.Types.ObjectId[];
    groups: mongoose.Types.ObjectId[];
    pages: mongoose.Types.ObjectId[];
    friendRequests: mongoose.Types.ObjectId[];
    blockedUsers: mongoose.Types.ObjectId[];
    stories: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    coverPhoto: { type: String },
    gender: { type: String },
    marital_status: { type: String },
    bio: { type: String },
    phone: { type: String },
    location: { type: String },
    website: { type: String },
    friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    groups: [{ type: mongoose.Types.ObjectId, ref: 'Group' }],
    pages: [{ type: mongoose.Types.ObjectId, ref: 'Page' }],
    friendRequests: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    blockedUsers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    stories: [{
        type: Schema.Types.ObjectId,
        ref: "Story"
    }]
}, { timestamps: true });;

UserSchema.pre<IUser>("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model<IUser>("User", UserSchema);
export { UserModel, IUser };
