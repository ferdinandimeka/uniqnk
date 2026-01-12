// src/domain/entities/Settings.ts

export class Settings {
  constructor(
    public readonly id: string,
    public readonly userId: string,

    // PROFILE
    public profile: {
      showActivityStatus: boolean;
      showLastSeen: boolean;
      profileVisibility: "public" | "followers" | "private";
    } = {
      showActivityStatus: true,
      showLastSeen: true,
      profileVisibility: "public",
    },

    // NOTIFICATIONS
    public notifications: {
      likes: boolean;
      comments: boolean;
      followers: boolean;
      reposts: boolean;
      interactedPosts: boolean;
      liveReels: boolean;
      mentions: boolean;
      sound: boolean;
      vibration: boolean;
    } = {
      likes: true,
      comments: true,
      followers: true,
      reposts: true,
      interactedPosts: true,
      liveReels: true,
      mentions: true,
      sound: true,
      vibration: true,
    },

    // SECURITY
    public security: {
      twoFactorAuth: boolean;
      loginAlerts: boolean;
      authorizedDevices: {
        device: string;
        ip: string;
        lastActive: Date;
      }[];
    } = {
      twoFactorAuth: false,
      loginAlerts: true,
      authorizedDevices: [],
    },

    // ACTIVITY
    public activity: {
      recentSearches: string[];
      loginHistory: {
        device: string;
        location: string;
        ip: string;
        date: Date;
      }[];
    } = {
      recentSearches: [],
      loginHistory: [],
    },

    // PRIVACY
    public privacy: {
      allowTagsFrom: "everyone" | "followers" | "no_one";
      allowMessagesFrom: "everyone" | "followers";
      dataDownload: boolean;
    } = {
      allowTagsFrom: "everyone",
      allowMessagesFrom: "everyone",
      dataDownload: false,
    },

    // RESTRICTIONS
    public restrictions: {
      mutedUsers: string[];
      restrictedUsers: string[];
    } = {
      mutedUsers: [],
      restrictedUsers: [],
    },

    // SUPPORT / REPORTS
    public support: {
      reports: {
        category: string;
        description: string;
        images: string[];
        createdAt: Date;
      }[];
    } = {
      reports: [],
    },

    // LEGAL
    public legal: {
      termsAccepted: boolean;
      privacyPolicyAccepted: boolean;
    } = {
      termsAccepted: false,
      privacyPolicyAccepted: false,
    },

    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}
