import mongoose from "mongoose";
import { NotificationModel, INotification } from "../models/NotificationModel";
import { NotificationMapper } from "../../mappers/notificationsMapper";
import { Notification } from "../../domain/entities/Notification";

export class NotificationRepository {
  /**
   * Create or aggregate a notification
   */
  async createOrAggregate({
    userId,
    type,
    actorId,
    postId,
    commentId,
    content,
  }: {
    userId: string;
    type: string;
    actorId: string;
    postId?: string | undefined;
    commentId?: string | undefined;
    content: string;
  }): Promise<INotification> {
    const query: any = {
      user: userId,
      type,
      isRead: false,
    };

    if (postId) query.post = postId;
    if (commentId) query.comment = commentId;

    let notification = await NotificationModel.findOne(query);

    if (notification) {
      const alreadyExists = notification.actors.some((id) =>
        id.equals(new mongoose.Types.ObjectId(actorId))
      );

      if (!alreadyExists) {
        notification.actors.push(new mongoose.Types.ObjectId(actorId));
        notification.count += 1;

        notification.content =
          notification.count > 1
            ? `${notification.count} people ${content}`
            : content;

        await notification.save();
      }

      return notification;
    }

    // Create new notification
    const createdNotification = await NotificationModel.create({
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      type,
      actors: [actorId],
      count: 1,
      post: postId,
      comment: commentId,
      content,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NotificationMapper.mapToDomain(createdNotification.toObject()) as unknown as INotification;
  }

  /**
   * Get user notifications (paginated)
   */
  async getUserNotifications(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<INotification[]> {
     return NotificationModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("actors", "username profilePicture") as Promise<INotification[]>;
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<Notification | null> {
    return NotificationModel.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true },
      { new: true }
    );
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return NotificationModel.countDocuments({
      user: userId,
      isRead: false,
    });
  }

  /**
   * Delete old notifications (optional cleanup)
   */
  async deleteOlderThan(daysOld: number): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);

    await NotificationModel.deleteMany({
      createdAt: { $lt: cutoff },
      isRead: true,
    });
  }
  
}