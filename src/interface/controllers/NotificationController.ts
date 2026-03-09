import { CreateOrAggregate } from "./../../use-cases/notification/create";
import { GetUnreadCount } from "../../use-cases/notification/getUnreadCount";
import { GetUserNotification } from "../../use-cases/notification/getUserNotification";
import { MarkAsRead } from "../../use-cases/notification/markAsRead";
import { MarkAllAsRead } from "../../use-cases/notification/markAllAsRead";
import { DeleteOlderThan } from "../../use-cases/notification/deleteOlderThan";
import { NextFunction, Request, Response } from 'express'
import { getParam } from '../../utils/helper';

export class NotificationController {
  constructor(
    private createOrAggregateUseCase: CreateOrAggregate, 
    private getUnreadCountUseCase: GetUnreadCount,
    private getUserNotificationUseCase: GetUserNotification,
    private markAsReadUseCase: MarkAsRead,
    private markAllAsReadUseCase: MarkAllAsRead,
    private deleteOlderThanUseCase: DeleteOlderThan
  ) {}

  createOrAggregate = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const { userId, type, actorId, postId, commentId, content } = req.body;
      await this.createOrAggregateUseCase.execute(userId, type, actorId, postId, commentId, content);
      return res.status(201).json({ message: "Notification created or aggregated successfully" });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "Failed to create or aggregate notification" });
    }
  }

  getUnreadCount = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const userId = getParam(req.params.userId);
      const count = await this.getUnreadCountUseCase.execute(userId);
      return res.status(200).json({ count });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "Failed to get unread count" });
    }
  }

  getUserNotifications = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const userId = getParam(req.params.userId);
      const page = parseInt(String(req.query.page ?? "1"), 10);
      const limit = parseInt(String(req.query.limit ?? "20"), 10);
      const notifications = await this.getUserNotificationUseCase.execute(userId, page, limit);
      return res.status(200).json(notifications);
    } catch (error) {
      return next(error);
      // return res.status(500).json({ success: false, message: "Failed to get user notifications" });
    }
  }

  markAsRead = async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const notificationId = getParam(req.params.notificationId);
      const userId = getParam(req.params.userId);
      await this.markAsReadUseCase.execute(notificationId, userId);
      return res.status(200).json({ message: "Notification marked as read successfully" });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "Failed to mark notification as read" });
    }
  }

  markAllAsRead = async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const userId = getParam(req.params.userId);
      await this.markAllAsReadUseCase.execute(userId);
      return res.status(200).json({ message: "All notifications marked as read successfully" });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "Failed to mark all notifications as read" });
    }
  }

  deleteOlderThan = async(req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
      const daysOld = parseInt(getParam(req.params.daysOld), 10);
      await this.deleteOlderThanUseCase.execute(daysOld);
      return res.status(200).json({ message: "Old notifications deleted successfully" });
    } catch (error) {
      next(error);
      return res.status(500).json({ success: false, message: "Failed to delete old notifications" });
    }
  }
}