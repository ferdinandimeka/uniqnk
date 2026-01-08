// src/dtos/update-notification.dto.ts
export interface UpdateNotificationDTO {
    likes?: boolean;
    comments?: boolean;
    followers?: boolean;
    directMessages?: boolean;
    mentions?: boolean;
    profileViews?: boolean;
    sound?: boolean;
    vibration?: boolean;

    email?: {
        feedbackEmails?: boolean;
        reminderEmails?: boolean;
        promotionalEmails?: boolean;
        productEmails?: boolean;
        supportEmails?: boolean;
        securityEmails?: boolean;
    };
}
