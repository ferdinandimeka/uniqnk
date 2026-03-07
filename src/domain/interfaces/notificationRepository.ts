import { Notification } from "../entities/Notification";

export interface NotificationRepository {
    createOrAggregate(params: {
        userId: string,
        type: string,
        actorId: string,
        postId?: string | undefined,
        commentId?: string | undefined,
        content: string 
    }): Promise<Notification>;
    getUserNotifications(userId: string, page?: number, limit?: number): Promise<Notification[]>;
    markAsRead(notificationId: string, userId: string): Promise<Notification | null>;
    markAllAsRead(userId: string): Promise<void>;
    getUnreadCount(userId: string): Promise<number>;
    deleteOlderThan(daysOld: number): Promise<void>;
}