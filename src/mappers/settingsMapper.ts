// src/mappers/settingsMapper.ts

import { Settings } from "../domain/entities/Settings";

export function mapSettings(doc: any): Settings {
    if (!doc) return null as any;

    return new Settings(
        doc._id.toString(),
        doc.userId.toString(),

        doc.showOnlineStatus,
        doc.showActivityStatus,
        doc.showLastSeen,

        doc.pushNotifications,
        doc.messageNotifications,
        doc.friendRequestNotifications,
        doc.tagNotifications,
        doc.soundEnabled,

        doc.twoFactorEnabled,
        doc.loginAlerts,
        doc.recognizedDevices,

        doc.whoCanMessage,
        doc.whoCanAddToGroups,
        doc.whoCanSeeMyPosts,
        doc.blockedUsers?.map((id: any) => id.toString()) ?? [],

        doc.restrictedMode,

        doc.aboutApp,
        doc.termsAccepted,

        doc.lastReportMessage,
        doc.lastSupportRequest,

        doc.createdAt,
        doc.updatedAt
    );
}
