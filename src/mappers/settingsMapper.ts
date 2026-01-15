// src/infrastructure/mappers/settingsMapper.ts

import { Settings } from "../domain/entities/Settings";

export function mapSettings(doc: any): Settings {
  if (!doc) return null as any;

  const settings = doc.settings ?? {};

  return new Settings(
    doc._id.toString(),
    doc._id.toString(), // userId === user _id

    {
    //   showOnlineStatus: settings.profile?.showOnlineStatus ?? true,
      showActivityStatus: settings.profile?.showActivityStatus ?? true,
      showLastSeen: settings.profile?.showLastSeen ?? true,
      profileVisibility: settings.profile?.profileVisibility ?? "public",
    },
    {
      email: {
        feedbackEmails: settings.notifications?.email?.feedbackEmails ?? true,
        reminderEmails: settings.notifications?.email?.reminderEmails ?? true,
        promotionalEmails: settings.notifications?.email?.promotionalEmails ?? false,
        productEmails: settings.notifications?.email?.productEmails ?? true,
        supportEmails: settings.notifications?.email?.supportEmails ?? true,
        securityEmails: settings.notifications?.email?.securityEmails ?? true,
      },
      likes: settings.notifications?.likes ?? true,
      comments: settings.notifications?.comments ?? true,
      followers: settings.notifications?.followers ?? true,
      reposts: settings.notifications?.reposts ?? true,
      interactedPosts: settings.notifications?.interactedPosts ?? true,
      liveReels: settings.notifications?.liveReels ?? true,
      mentions: settings.notifications?.mentions ?? true,
      sound: settings.notifications?.sound ?? true,
      vibration: settings.notifications?.vibration ?? true,
    },

    {
      twoFactorAuth: settings.security?.twoFactorAuth ?? false,
      loginAlerts: settings.security?.loginAlerts ?? true,
      authorizedDevices: settings.security?.authorizedDevices ?? [],
    },

    {
      recentSearches: [],
      loginHistory: [],
    },

    {
      allowTagsFrom: settings.restrictions?.allowTagsFrom ?? "everyone",
      allowMessagesFrom: settings.restrictions?.allowMessagesFrom ?? "followers",
      dataDownload: settings.restrictions?.dataDownload ?? false,
    },

    {
      mutedUsers: settings.support?.mutedUsers ?? [],
      restrictedUsers: settings.support?.restrictedUsers ?? [],
    },

    {
      reports: settings.legal?.reports ?? [],
    },

    doc.createdAt,
    doc.updatedAt
  );
}
