import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { profile } from "console";

interface IUserSettings {
    profile: {
        showActivityStatus: boolean;
        showLastSeen: boolean;
        profileVisibility: "public" | "followers" | "private";
    };
    notifications: {
        likes: boolean;
        comments: boolean;
        followers: boolean;
        reposts: boolean;
        liveReels: boolean;
        interactedPosts: boolean;
        mentions: boolean;
        sound: boolean;
        vibration: boolean;
        // 🔔 Email notifications
        email: {
            feedbackEmails: boolean;      // surveys, feedback requests
            reminderEmails: boolean;      // reminders, scheduled actions
            promotionalEmails: boolean;   // marketing & promos
            productEmails: boolean;       // product updates, new features
            supportEmails: boolean;       // support replies, ticket updates
            securityEmails: boolean;      // password reset, login alerts
        };
    };
    security: {
        twoFactorAuth: boolean;
        loginAlerts: boolean;
        authorizedDevices: {
            device: string;
            ip: string;
            lastActive: Date;
        }[];
    };
    activity: {
        recentSearches: string[];
        loginHistory: {
            device: string;
            location: string;
            ip: string;
            date: Date;
        }[];
    };
    privacy: {
        allowTagsFrom: "everyone" | "followers" | "no_one";
        allowMessagesFrom: "everyone" | "followers";
        dataDownload: boolean;
    };
    restrictions: {
        mutedUsers: mongoose.Types.ObjectId[];
        restrictedUsers: mongoose.Types.ObjectId[];
    };
    support: {
        reports: {
            category: string;
            description: string;
            images: string[];
            createdAt: Date;
        }[];
    };
    legal: {
        termsAccepted: boolean;
        privacyPolicyAccepted: boolean;
    };
}

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

    settings: IUserSettings;

    createdAt: Date;
    updatedAt: Date;

    comparePassword(candidatePassword: string): Promise<boolean>;
}

const SettingsSchema = new Schema({
    profile: {
        showActivityStatus: { type: Boolean, default: true },
        showLastSeen: { type: Boolean, default: true },
        profileVisibility: {
            type: String,
            enum: ["public", "followers", "private"],
            default: "public"
        }
    },

    notifications: {
        likes: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        followers: { type: Boolean, default: true },
        reposts: { type: Boolean, default: true },
        interactedPosts: { type: Boolean, default: true },
        liveReels: { type: Boolean, default: true },
        mentions: { type: Boolean, default: true },
        sound: { type: Boolean, default: true },
        vibration: { type: Boolean, default: true },
        profileViews: { type: Boolean, default: true },
         // 📧 Email notification preferences
        email: {
            feedbackEmails: { type: Boolean, default: true },
            reminderEmails: { type: Boolean, default: true },
            promotionalEmails: { type: Boolean, default: false }, // ⚠️ opt-in
            productEmails: { type: Boolean, default: true },
            supportEmails: { type: Boolean, default: true },
            securityEmails: { type: Boolean, default: true }
        }
    },

    security: {
        twoFactorAuth: { type: Boolean, default: false },
        loginAlerts: { type: Boolean, default: true },
        authorizedDevices: [
        {
            device: String,
            ip: String,
            lastActive: Date
        }
    ]
  },

    activity: {
        recentSearches: [String],
        loginHistory: [
        {
            device: String,
            location: String,
            ip: String,
            date: Date
        }
        ]
    },

    privacy: {
        allowTagsFrom: {
            type: String,
            enum: ["everyone", "followers", "no_one"],
            default: "everyone"
        },
        allowMessagesFrom: {
            type: String,
            enum: ["everyone", "followers"],
            default: "everyone"
        },
        dataDownload: { type: Boolean, default: false }
    },

    restrictions: {
        mutedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
        restrictedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },

    support: {
        reports: [
        {
            category: String,
            description: String,
            images: [String],
            createdAt: { type: Date, default: Date.now }
        }
        ]
    },

    legal: {
        termsAccepted: { type: Boolean, default: false },
        privacyPolicyAccepted: { type: Boolean, default: false }
    }
});

const UserSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },

    profilePicture: String,
    coverPhoto: String,
    gender: String,
    marital_status: String,
    bio: String,
    phone: String,
    location: String,
    website: String,

    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: Schema.Types.ObjectId, ref: "User" }],

    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    groups: [{ type: Schema.Types.ObjectId, ref: "Group" }],
    pages: [{ type: Schema.Types.ObjectId, ref: "Page" }],

    friendRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],

    stories: [{ type: Schema.Types.ObjectId, ref: "Story" }],

    settings: { type: SettingsSchema, default: () => ({}) }
}, { timestamps: true });

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

