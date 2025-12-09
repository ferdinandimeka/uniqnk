// src/repositories/SettingsRepository.ts

import { Settings } from "../entities/Settings";

export interface SettingsRepository {
    getByUserId(userId: string): Promise<Settings | null>;
    create(settings: Settings): Promise<Settings>;
    update(settings: Settings): Promise<void>;

    // PROFILE
    updateProfilePreferences(
        userId: string,
        prefs: Partial<Pick<Settings,
            "showOnlineStatus" |
            "showActivityStatus" |
            "showLastSeen"
        >>
    ): Promise<Settings>;

    // NOTIFICATIONS
    updateNotificationSettings(
        userId: string,
        prefs: Partial<Pick<Settings,
            "pushNotifications" |
            "messageNotifications" |
            "friendRequestNotifications" |
            "tagNotifications" |
            "soundEnabled"
        >>
    ): Promise<Settings>;

    // SECURITY
    updateSecuritySettings(
        userId: string,
        prefs: Partial<Pick<Settings,
            "twoFactorEnabled" |
            "loginAlerts" |
            "recognizedDevices"
        >>
    ): Promise<Settings>;

    disableAccount(userId: string): Promise<Settings>;
    deleteAccount(userId: string): Promise<Settings>;

    // PRIVACY
    updatePrivacySettings(
        userId: string,
        prefs: Partial<Pick<Settings,
            "whoCanMessage" |
            "whoCanAddToGroups" |
            "whoCanSeeMyPosts"
        >>
    ): Promise<Settings>;

    blockUser(userId: string, blockedId: string): Promise<Settings>;
    unBlockUser(userId: string, blockedId: string): Promise<Settings>;

    // RESTRICTIONS
    updateRestrictions(
        userId: string,
        prefs: Partial<Pick<Settings, "restrictedMode">>
    ): Promise<Settings>;

    // SUPPORT
    // reportProblem(userId: string, message: string): Promise<Settings>;
    saveSupportRequest(userId: string, message: string): Promise<Settings>;
    reportMessage(userId: string, report: string): Promise<Settings>;
}
