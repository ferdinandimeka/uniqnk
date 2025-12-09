// src/entities/Settings.ts

export class Settings {
    constructor(
        public readonly id: string,
        public userId: string,

        // PROFILE
        public showOnlineStatus: boolean = true,
        public showActivityStatus: boolean = true,
        public showLastSeen: boolean = true,

        // NOTIFICATIONS
        public pushNotifications: boolean = true,
        public messageNotifications: boolean = true,
        public friendRequestNotifications: boolean = true,
        public tagNotifications: boolean = true,
        public soundEnabled: boolean = true,

        // ACCOUNT SECURITY
        public twoFactorEnabled: boolean = false,
        public loginAlerts: boolean = true,
        public recognizedDevices: Array<{ device: string; lastActive: Date }> = [],

        // PRIVACY
        public whoCanMessage: "everyone" | "friends" | "no_one" = "everyone",
        public whoCanAddToGroups: "everyone" | "friends" | "no_one" = "everyone",
        public whoCanSeeMyPosts: "everyone" | "friends" | "only_me" = "everyone",
        public blockedUsers: string[] = [],

        // RESTRICTIONS
        public restrictedMode: boolean = false,

        // APP INFO
        public aboutApp: string = "Social App v1.0",
        public termsAccepted: boolean = true,

        // REPORT + SUPPORT
        public lastReportMessage?: string,
        public lastSupportRequest?: string,

        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {}
}
