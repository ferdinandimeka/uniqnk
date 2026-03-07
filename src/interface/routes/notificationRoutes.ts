import { CreateOrAggregate } from "./../../use-cases/notification/create";
import { GetUnreadCount } from "../../use-cases/notification/getUnreadCount";
import { GetUserNotification } from "../../use-cases/notification/getUserNotification";
import { MarkAsRead } from "../../use-cases/notification/markAsRead";
import { MarkAllAsRead } from "../../use-cases/notification/markAllAsRead";
import { DeleteOlderThan } from "../../use-cases/notification/deleteOlderThan";
import { Router, Request, Response, NextFunction } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { NotificationRepository } from "../../infrastructure/repositories/MongoNotificationRepository";

const useRouter = Router();

const notificationRepo = new NotificationRepository();

const createOrAggregate = new CreateOrAggregate(notificationRepo);
const getUnreadCount = new GetUnreadCount(notificationRepo);
const getUserNotification = new GetUserNotification(notificationRepo);
const markAsRead = new MarkAsRead(notificationRepo);
const markAllAsRead = new MarkAllAsRead(notificationRepo);
const deleteOlderThan = new DeleteOlderThan(notificationRepo);

const notificationController = new NotificationController(
  createOrAggregate,
  getUnreadCount,
    getUserNotification,
    markAsRead,
    markAllAsRead,
    deleteOlderThan
);

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing user notifications
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   post:
 *     summary: Create or aggregate a notification
 *     description: Create a new notification or aggregate it with an existing one
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification created or aggregated successfully
 *       400:
 *         description: Bad request
 */
useRouter.post("/", (req, res, next) => notificationController.createOrAggregate(req, res, next));

/**
 * @swagger
 * /api/v1/notifications/unread-count/{userId}:
 *   get:
 *     summary: Get unread notification count for a user
 *     description: Retrieve the count of unread notifications for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unread notification count retrieved successfully
 *       404:
 *         description: User not found
 */
useRouter.get("/unread-count/:userId", (req, res, next) => notificationController.getUnreadCount(req, res, next));

/**
 * @swagger
 * /api/v1/notifications/user/{userId}:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieve notifications for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User notifications retrieved successfully
 *       404:
 *         description: User not found
 */
useRouter.get("/user/:userId", (req, res, next) => notificationController.getUserNotifications(req, res, next));

/**
 * @swagger
 * /api/v1/notifications/mark-as-read/{notificationId}:
 *   put:
 *     summary: Mark a notification as read
 *     description: Update the read status of a specific notification
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       404:
 *         description: Notification not found
 */

useRouter.put("/mark-as-read/:notificationId", (req, res, next) => notificationController.markAsRead(req, res, next));

/**
 * @swagger
 * /api/v1/notifications/mark-all-as-read/{userId}:
 *   put:
 *     summary: Mark all notifications as read for a user
 *     description: Update the read status of all notifications for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 *       404:
 *         description: User not found
 */
useRouter.put("/mark-all-as-read/:userId", (req, res, next) => notificationController.markAllAsRead(req, res, next));

/**
 * @swagger
 * /api/v1/notifications/delete-older-than/{date}:
 *   delete:
 *     summary: Delete notifications older than a specific date
 *     description: Remove notifications that were created before a specified date
 *     parameters:
 *       - in: path
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Notifications deleted successfully
 *       400:
 *         description: Bad request
 */
useRouter.delete("/delete-older-than/:date", (req, res, next) => notificationController.deleteOlderThan(req, res, next));

export { useRouter as notificationRoutes }