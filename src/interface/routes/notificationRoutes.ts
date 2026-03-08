import { CreateOrAggregate } from "./../../use-cases/notification/create";
import { GetUnreadCount } from "../../use-cases/notification/getUnreadCount";
import { GetUserNotification } from "../../use-cases/notification/getUserNotification";
import { MarkAsRead } from "../../use-cases/notification/markAsRead";
import { MarkAllAsRead } from "../../use-cases/notification/markAllAsRead";
import { DeleteOlderThan } from "../../use-cases/notification/deleteOlderThan";
import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { NotificationRepository } from "../../infrastructure/repositories/MongoNotificationRepository";

const router = Router();

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
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - user
 *         - type
 *         - actor
 *       properties:
 *         user:
 *           type: string
 *           example: "665ab1234f9c123456789012"
 *         type:
 *           type: string
 *           example: "like"
 *         actor:
 *           type: string
 *           example: "665ab1234f9c123456789999"
 *         post:
 *           type: string
 *           example: "665ab1234f9c123456789888"
 *         comment:
 *           type: string
 *           example: "665ab1234f9c123456789777"
 *         content:
 *           type: string
 *           example: "liked your post"
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   post:
 *     tags: [Notifications]
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
router.post("/", notificationController.createOrAggregate);

/**
 * @swagger
 * /api/v1/notifications/unread-count/{userId}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get unread notification count
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unread notification count retrieved successfully
 */
router.get("/unread-count/:userId", notificationController.getUnreadCount);

/**
 * @swagger
 * /api/v1/notifications/user/{userId}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get user notifications
 *     description: Retrieve notifications for a specific user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: User notifications retrieved successfully
 *       404:
 *         description: User not found
 */
router.get("/user/:userId", notificationController.getUserNotifications);

/**
 * @swagger
 * /api/v1/notifications/mark-as-read/{notificationId}:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 */
router.put("/mark-as-read/:notificationId", notificationController.markAsRead);

/**
 * @swagger
 * /api/v1/notifications/mark-all-as-read/{userId}:
 *   put:
 *     tags: [Notifications]
 *     summary: Mark all notifications as read
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully
 */
router.put("/mark-all-as-read/:userId", notificationController.markAllAsRead);

/**
 * @swagger
 * /api/v1/notifications/delete-older-than/{date}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete notifications older than a date
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
 */
router.delete("/delete-older-than/:date", notificationController.deleteOlderThan);

export { router as notificationRoutes };