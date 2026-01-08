// src/interface/routes/settingsRoutes.ts

import { Router } from "express";
import { MongoSettingsRepository } from "../../infrastructure/repositories/MongoSettingsRepository";

// Use-cases
import { GetSettingsByUserId } from "../../use-cases/settings/getSettingsByUserId";
import { UpdateProfilePreferences } from "../../use-cases/settings/updateProfilePreferences";
import { UpdateNotificationSettings } from "../../use-cases/settings/updateNotification";
import { UpdatePrivacySettings } from "../../use-cases/settings/updatePrivacy";
import { UpdateSecuritySettings } from "../../use-cases/settings/updateSecurity";
import { UpdateRestrictionSettings } from "../../use-cases/settings/updateRestrictions";
import { BlockUser } from "../../use-cases/settings/blockUser";
import { UnBlockUser } from "../../use-cases/settings/unBlockUser";
import { ReportProblem } from "../../use-cases/settings/reportProblem";

import { SettingsController } from "../controllers/SettingsController";

const router = Router();
const settingsRepository = new MongoSettingsRepository();

// Instantiate use-cases
const getSettings = new GetSettingsByUserId(settingsRepository);
const updateProfile = new UpdateProfilePreferences(settingsRepository);
const updateNotifications = new UpdateNotificationSettings(settingsRepository);
const updatePrivacy = new UpdatePrivacySettings(settingsRepository);
const updateSecurity = new UpdateSecuritySettings(settingsRepository);
const updateRestrictions = new UpdateRestrictionSettings(settingsRepository);
const blockUser = new BlockUser(settingsRepository);
const unblockUser = new UnBlockUser(settingsRepository);
const sendReport = new ReportProblem(settingsRepository);

// Controller
const controller = new SettingsController(
    getSettings,
    updateProfile,
    updateNotifications,
    updatePrivacy,
    updateSecurity,
    updateRestrictions,
    blockUser,
    unblockUser,
    sendReport,
);

/**
 * @swagger
 * tags:
 *   name: Settings
 *   description: User settings endpoints
 */

/**
 * @swagger
 * /api/v1/settings/{userId}:
 *   get:
 *     summary: Get all settings for a user
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User settings fetched successfully
 */
router.get("/:userId", (req, res, next) => controller.getSettings(req, res, next));

/**
 * @swagger
 * /api/v1/settings/{userId}/preferences:
 *   put:
 *     summary: Update profile preferences (theme, language, autoplay, data usage)
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theme:
 *                 type: string
 *                 example: "dark"
 *               language:
 *                 type: string
 *                 example: "en"
 *               autoplayVideos:
 *                 type: boolean
 *                 example: true
 *               dataSaver:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Profile preferences updated
 */
router.put("/:userId/preferences", (req, res, next) =>
    controller.updateProfileSettings(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/notifications:
 *   put:
 *     summary: Update notification settings
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               likes:
 *                 type: boolean
 *                 example: true
 *               comments:
 *                 type: boolean
 *                 example: true
 *               followers:
 *                 type: boolean
 *                 example: false
 *               directMessages:
 *                 type: boolean
 *                 example: true
 *               mentions:
 *                 type: boolean
 *                 example: true
 *               profileViews:
 *                 type: boolean
 *                 example: true
 *               sound:
 *                 type: boolean
 *                 example: true
 *               vibration:
 *                 type: boolean
 *                 example: false
 *               email:
 *                 type: object
 *                 properties:
 *                   feedbackEmails:
 *                     type: boolean
 *                     example: true
 *                   reminderEmails:
 *                     type: boolean
 *                     example: false
 *                   promotionalEmails:
 *                     type: boolean
 *                     example: false
 *                   productEmails:
 *                     type: boolean
 *                     example: true
 *                   supportEmails:
 *                     type: boolean
 *                     example: true
 *                   securityEmails:
 *                     type: boolean
 *                     example: true
 *     responses:
 *       200:
 *         description: Notification settings updated successfully
 *       400:
 *         description: Invalid notification payload
 *       404:
 *         description: User not found
 */

router.put("/:userId/notifications", (req, res, next) =>
    controller.updateNotificationSettings(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/privacy:
 *   put:
 *     summary: Update privacy settings
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profileVisibility:
 *                 type: string
 *                 example: "friends_only"
 *               showActivityStatus:
 *                 type: boolean
 *                 example: false
 *               showLastSeen:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Privacy settings updated
 */
router.put("/:userId/privacy", (req, res, next) =>
    controller.updatePrivacySettings(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/security:
 *   put:
 *     summary: Update account security settings
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               twoFactorAuth:
 *                 type: boolean
 *                 example: true
 *               loginAlerts:
 *                 type: boolean
 *                 example: true
 *               deviceHistory:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["iPhone 14", "Galaxy S22"]
 *     responses:
 *       200:
 *         description: Security settings updated
 */
router.put("/:userId/security", (req, res, next) =>
    controller.updateSecuritySettings(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/restrictions:
 *   put:
 *     summary: Update restriction settings (blocked accounts, limits)
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               blockedUsers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["67283289bd83298bd123aa"]
 *               restrictedMode:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Restriction settings updated
 */
router.put("/:userId/restrictions", (req, res, next) =>
    controller.updateRestrictions(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/block:
 *   post:
 *     summary: Block another user
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user performing the block
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetUserId]
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 example: "678ffe2ba09d3a21e3bf45b9"
 *     responses:
 *       200:
 *         description: User blocked successfully
 *       400:
 *         description: User already blocked or invalid target
 *       404:
 *         description: User not found
 */
router.post("/:userId/block", (req, res, next) =>
    controller.blockUserHandler(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/unblock:
 *   post:
 *     summary: Unblock a user
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetUserId]
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 example: "678ffe2ba09d3a21e3bf45b9"
 *     responses:
 *       200:
 *         description: User unblocked successfully
 *       400:
 *         description: User is not blocked
 *       404:
 *         description: User not found
 */
router.post("/:userId/unblock", (req, res, next) =>
    controller.unblockUserHandler(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/report:
 *   post:
 *     summary: Report a problem with optional screenshot + description
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "App keeps crashing when I open messages."
 *               screenshotUrl:
 *                 type: string
 *                 example: "https://yourapp.com/uploads/issue123.png"
 *     responses:
 *       200:
 *         description: Report submitted successfully
 */
router.post("/:userId/report", (req, res, next) =>
    controller.reportProblem(req, res, next)
);

export { router as settingsRoutes };
