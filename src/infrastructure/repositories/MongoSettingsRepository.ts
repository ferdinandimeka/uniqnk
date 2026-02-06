// src/repositories/mongo/MongoSettingsRepository.ts
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import bcrypt from "bcryptjs";
import { Settings } from "../../domain/entities/Settings";
import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { UserModel } from "../models/UserModel";
import { mapSettings } from "../../mappers/settingsMapper";
import { UpdateNotificationDTO } from "../../dtos/update-notification.dto";

export class MongoSettingsRepository implements SettingsRepository {

    async getByUserId(userId: string): Promise<Settings | null> {
        const doc = await UserModel.findById(userId);
        console.log("doc: ", doc)
        return mapSettings(doc); // Ensure the return type is Settings
    }

    async create(settings: Settings): Promise<Settings> {
        const doc = await new UserModel(settings).save();
        return mapSettings(doc);
    }

    async update(settings: Settings): Promise<void> {
        await UserModel.updateOne({ userId: settings.userId }, settings);
    }

    async updateProfilePreferences(userId: string, prefs: Partial<Settings>): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: prefs },
            { new: true }
        );
        return mapSettings(doc);
    }

    async updateNotificationSettings(
        userId: string,
        settings: UpdateNotificationDTO
    ): Promise<UpdateNotificationDTO> {

        if (!settings || Object.keys(settings).length === 0) {
            throw new Error("No notification fields to update");
        }

        const updateFields: Record<string, any> = {};

        const buildPaths = (obj: any, prefix = "settings.notifications") => {
            for (const [key, value] of Object.entries(obj)) {
            const path = `${prefix}.${key}`;

            if (
                value !== null &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {
                buildPaths(value, path);
            } else {
                updateFields[path] = value;
            }
            }
        };

        buildPaths(settings);

        console.log("Update Fields:", updateFields); // ✅ DEBUG

        const doc = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!doc) {
            throw new Error("User not found");
        }

        return doc.settings.notifications;
    }

    async updateAuth(userId: string, settings: Settings): Promise<Settings> {
        const docs = await UserModel.findById(userId);
        console.log("doc: ", docs)
        if (!docs) {
            throw new Error("User not found");
        }
        if (!settings || Object.keys(settings).length === 0) {
            throw new Error("No fields to update");
        }

        const updateFields: Record<string, any> = {};

        const buildPaths = (obj: any, prefix = "settings") => {
            for (const [key, value] of Object.entries(obj)) {
            const path = `${prefix}.${key}`;

            if (
                value !== null &&
                typeof value === "object" &&
                !Array.isArray(value)
            ) {
                buildPaths(value, path);
            } else {
                updateFields[path] = value;
            }
            }
        };

        buildPaths(settings);

        console.log("Update Fields:", updateFields); // ✅ DEBUG

        const doc = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!doc) {
            throw new Error("User not found");
        }

        return mapSettings(doc);
    }

    async verifyPinOrBiometric(userId: string): Promise<boolean> {
        const doc = await UserModel.findById(userId);
        if (!doc) {
            throw new Error("User not found");
        }
        // check user settings for pin or biometric
        const hasPin = doc.settings?.login.pinEnabled ? true : false;
        const hasBiometric = doc.settings?.login?.biometricEnabled ? true : false;
        return hasPin || hasBiometric;
    }

    async updateSecuritySettings(userId: string, prefs: Partial<Settings>): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: prefs },
            { new: true }
        );
        return mapSettings(doc);
    }

    async disableAccount(userId: string): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: { accountDisabled: true } },
            { new: true }
        );
        return mapSettings(doc);
    }

    async deleteAccount(userId: string): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: { accountDeleted: true } },
            { new: true }
        );
        return mapSettings(doc);
    }

    async updatePrivacySettings(userId: string, prefs: Partial<Settings>): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: prefs },
            { new: true }
        );
        return mapSettings(doc);
    }

    async blockUser(userId: string, blockedId: string): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $addToSet: { blockedUsers: blockedId } },
            { new: true }
        );
        return mapSettings(doc);
    }

    async unBlockUser(userId: string, blockedId: string): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $pull: { blockedUsers: blockedId } },
            { new: true }
        );
        return mapSettings(doc);
    }

    // async removeBlockedUser(userId: string, blockedId: string): Promise<Settings> {
    //     const doc = await UserModel.findOneAndUpdate(
    //         { userId },
    //         { $pull: { blockedUsers: blockedId } },
    //         { new: true }
    //     );
    //     return mapSettings(doc);
    // }

    async updateRestrictions(userId: string, prefs: Partial<Settings>): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: prefs },
            { new: true }
        );
        return mapSettings(doc);
    }

    // async reportProblem(userId: string, )

    async saveSupportRequest(userId: string, message: string): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: { lastSupportRequest: message } },
            { new: true }
        );
        return mapSettings(doc);
    }

    async reportMessage(userId: string, report: string): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: { lastReportMessage: report } },
            { new: true }
        );
        return mapSettings(doc);
    }

    async setup2FA(userId: string): Promise<{ qrcode: string; secret: string }> {
        const secret = speakeasy.generateSecret({ length: 20 })

        const qrcode = await QRCode.toDataURL(secret.otpauth_url || '');

        await UserModel.findOneAndUpdate(
            { userId },
            { $set: { "settings.security.authenticatorSecret": secret.base32 } },
            { new: true }
        );

        return {
            qrcode,
            secret: secret.base32
        }
    }

    async setupSecurityQuestion(userId: string, questionId: string, answer: string): Promise<void> {
        const answerHash = await bcrypt.hash(answer.toLowerCase(), 12);

        await UserModel.findByIdAndUpdate(userId, {
            "settings.security.securityQuestionEnabled": true,
            "settings.security.securityQuestion": {
                questionId,
                answerHash
            }
        })
    }

    async verify2FA(userId: string, token: string): Promise<boolean> {
        const doc = await UserModel.findById(userId);
        if (!doc) {
            throw new Error("User not found");
        }

        const secret = doc.settings.security.authenticatorSecret;
        if (!secret) {
            throw new Error("2FA not enabled");
        }

        const valid = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token,
            window: 1
        });

        if (!valid) {
            throw new Error("Invalid 2FA token");
        }
        
        doc.settings.security.twoFactorMethods.authenticator = true
        doc.settings.security.twoFactorEnabled = true
        doc.settings.security.authenticatorSecret = "";

        await doc.save();

        return true;
    }
}