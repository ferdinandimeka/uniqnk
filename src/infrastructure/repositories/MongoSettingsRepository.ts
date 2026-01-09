// src/repositories/mongo/MongoSettingsRepository.ts

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


    // async updateNotificationSettings(
    //     userId: string,
    //     settings: Settings,
    // ): Promise<Settings> {

    //     if (!settings || Object.keys(settings).length === 0) {
    //         throw new Error("No notification fields to update");
    //     }

    //     // Build the nested update object
    //     const updateFields: Record<string, any> = {};
    //     if (settings) {
    //         for (const [key, value] of Object.entries(settings)) {
    //             updateFields[`settings.notifications.${key}`] = value as boolean;
    //         }
    //     }
    //     console.log("Update Fields:", updateFields); // DEBUG

    //     const doc = await UserModel.findByIdAndUpdate(
    //          userId,
    //         { $set: updateFields },
    //         { new: true }
    //     );

    //     if (!doc) {
    //         throw new Error("User not found");
    //     }

    //     return mapSettings(doc);
    // }

    // async updateNotificationSettings(userId: string, prefs: Partial<Settings>): Promise<Settings> {
    //     const doc = await UserModel.findOneAndUpdate(
    //         { userId },
    //         { $set: prefs },
    //         { new: true }
    //     );
    //     return mapSettings(doc);
    // }

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
