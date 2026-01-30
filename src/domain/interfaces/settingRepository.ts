// src/repositories/SettingsRepository.ts

import { Settings } from "../entities/Settings";
import { UpdateNotificationDTO } from "../../dtos/update-notification.dto";

export interface SettingsRepository {
    getByUserId(userId: string): Promise<Settings | null>;
    create(settings: Settings): Promise<Settings>;
    update(settings: Settings): Promise<void>;
    verifyPinOrBiometric(userId: string): Promise<boolean>;

    // PROFILE
    updateProfilePreferences(
        userId: string,
        prefs: Partial<Settings>
    ): Promise<Settings>;

    // NOTIFICATIONS
    updateNotificationSettings(
        userId: string,
        settings: UpdateNotificationDTO
    ): Promise<UpdateNotificationDTO>;

    // SECURITY
    updateSecuritySettings(
        userId: string,
        prefs: Partial<Pick<Settings,
            "security"
        >>
    ): Promise<Settings>;

    setupSecurityQuestion(
        userId: string,
        questionId: string,
        answer: string
    ): Promise<void>;

    setup2FA(userId: string): Promise<{qrcode: string; secret: string}>;
    verify2FA(userId: string, token: string): Promise<boolean>;

    updateAuth(user: string, settings: Settings): Promise<Settings>;

    disableAccount(userId: string): Promise<Settings>;
    deleteAccount(userId: string): Promise<Settings>;

    // PRIVACY
    updatePrivacySettings(
        userId: string,
        prefs: Partial<Pick<Settings,
            "privacy"
        >>
    ): Promise<Settings>;

    blockUser(userId: string, blockedId: string): Promise<Settings>;
    unBlockUser(userId: string, blockedId: string): Promise<Settings>;

    // RESTRICTIONS
    updateRestrictions(
        userId: string,
        prefs: Partial<Pick<Settings, "restrictions">>
    ): Promise<Settings>;

    // SUPPORT
    // reportProblem(userId: string, message: string): Promise<Settings>;
    saveSupportRequest(userId: string, message: string): Promise<Settings>;
    reportMessage(userId: string, report: string): Promise<Settings>;
}
