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
      likes: settings.notifications?.likes ?? true,
      comments: settings.notifications?.comments ?? true,
      followers: settings.notifications?.followers ?? true,
      directMessages: settings.notifications?.directMessages ?? true,
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
