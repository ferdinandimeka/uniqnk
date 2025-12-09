// src/repositories/mongo/MongoSettingsRepository.ts

import { Settings } from "../../domain/entities/Settings";
import { SettingsRepository } from "../../domain/interfaces/settingRepository";
import { UserModel } from "../models/UserModel";
import { mapSettings } from "../../mappers/settingsMapper";

export class MongoSettingsRepository implements SettingsRepository {

    async getByUserId(userId: string): Promise<Settings | null> {
        const doc = await UserModel.findOne({ userId });
        return mapSettings(doc) as Settings; // Ensure the return type is Settings
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

    async updateNotificationSettings(userId: string, prefs: Partial<Settings>): Promise<Settings> {
        const doc = await UserModel.findOneAndUpdate(
            { userId },
            { $set: prefs },
            { new: true }
        );
        return mapSettings(doc);
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
}
