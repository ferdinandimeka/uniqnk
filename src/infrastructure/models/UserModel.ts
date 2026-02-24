import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

interface IUserSettings {
    profile: {
        showActivityStatus: boolean;
        showLastSeen: boolean;
        profileVisibility: "public" | "followers" | "private";
    };
    login: {
        biometricEnabled: boolean;
        pinEnabled: boolean;
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
        authenticatorSecret: string;
        securityQuestionEnabled: boolean;
        securityQuestion?: {
            questionId: string;
            answerHash: string;
        };

        twoFactorEnabled: boolean;
        twoFactorMethods: {
            authenticator: boolean;
            sms: boolean;
            email: boolean;
        };
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
        isPrivateAccount: boolean;
        // Users explicitly allowed even if not followers
        permittedViewers: mongoose.Types.ObjectId[];
        allowTagsFrom: "everyone" | "followers" | "no_one";
        allowMessagesFrom: "everyone" | "followers";
        dataDownload: boolean;
    };
    accountStatus: {
        isActive: boolean;
        isDisabled: boolean;
        isDeactivated: boolean;

        disabledAt?: Date;
        disbledReason?: string;

        deactivatedAt?: Date;
        deactivationReason?: string;
    };
    accountRestriction: {
        isRestricted: boolean;
        restrictedAt?: Date;
        restrictedReason?: string;
        restrictedBy?: "user" | "admin" | "fraud_engine";
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

interface TransactionPin {
  pinHash: string;
  pinSet: boolean;
  pinUpdatedAt: Date;
  failedAttempts: number;
  lockedUntil?: Date;
}

interface IUser extends Document {
    fullName: string;
    email: string;
    username: string;
    password: string;
    transactionalPin?: TransactionPin;
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

    canLogin(): boolean;
    canTransact(): boolean;
    canBeViewedBy(viewerId?: mongoose.Types.ObjectId): boolean;
    isFollower(userId: mongoose.Types.ObjectId): boolean;
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
    login: {
        biometricEnabled: { type: Boolean, default: false },
        pinEnabled: { type: Boolean, default: false }
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
        authenticatorSecret: { type: String, default: null },
        securityQuestionEnabled: { type: Boolean, default: false },
        securityQuestion: {
            questionId: String,
            answerHash: String
        },

        twoFactorEnabled: { type: Boolean, default: false },
        twoFactorMethods: {
            authenticator: { type: Boolean, default: false },
            sms: { type: Boolean, default: false },
            email: { type: Boolean, default: false }
        },
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
        isPrivateAccount: { type: Boolean, default: false },
        permittedViewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
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

    accountStatus: {
        isActive: { type: Boolean, default: true },

        isDisabled: { type: Boolean, default: false },
        disabledAt: { type: Date },
        disabledReason: { type: String },

        isDeactivated: { type: Boolean, default: false },
        deactivatedAt: { type: Date },
        deactivationReason: { type: String }
    },

    accountRestriction: {
        isRestricted: { type: Boolean, default: false },
        restrictedAt: { type: Date },
        restrictedReason: { type: String },
        restrictedBy: {
            type: String,
            enum: ["user", "admin", "fraud_engine"]
        }
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
    transactionalPin: {
        pinHash: { type: String, required: true },
        pinSet: { type: Boolean, default: false },
        pinUpdatedAt: { type: Date, default: Date.now },
        failedAttempts: { type: Number, default: 0 },
        lockedUntil: { type: Date }
    },

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

UserSchema.methods.isFollower = function (viewerId?: mongoose.Types.ObjectId): boolean {
    return this.followers.some((followerId: mongoose.Types.ObjectId) => followerId.equals(viewerId));
}

UserSchema.methods.canBeViewedBy = function (viewerId?: mongoose.Types.ObjectId): boolean {
    // Owner can always view
    if (!viewerId || this._id.equals(viewerId)) {
        return true;
    }
    const privacy = this.settings.privacy;

    // Public account
    if (!privacy.isPrivateAccount) return true;

    // Explicitly permitted
    if (privacy.permittedViewers.some((id: mongoose.Types.ObjectId) => id.equals(viewerId))) {
        return true;
    }

    const status = this.settings?.accountStatus;

    // Disabled or deactivated accounts are hidden from others
    if (
        status?.isDisabled || status?.isDeactivated
    ) {
        return viewerId ? this._id.equals(viewerId) : false;
    }

    // Followers allowed
    return this.isFollower(viewerId);
}

UserSchema.methods.canLogin = function (): boolean {
    const status = this.settings?.accountStatus;

    // Safety fallback for legacy users
    if (!status) return true;

    if (!status.isActive) return false;
    if (status.isDisabled) return false;
    if (status.isDeactivated) return false;

    return true;
};

UserSchema.methods.canTransact = function (): boolean {
    const restriction = this.settings.accountRestriction;
    const status = this.settings.accountStatus;

    // Block if account status missing (fail-safe)
    if (!status) return false;

    // Hard blocks
    if (status.isDisabled) return false;
    if (status.isDeactivated) return false;

    // Emergency restriction
    if (restriction?.isRestricted) return false;

    return true;
};

const UserModel = mongoose.model<IUser>("User", UserSchema);
export { UserModel, IUser };

