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
// import { SendSupportRequest } from "../../use-cases/settings/sendSupportRequest";

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
// const sendSupport = new SendSupportRequest(settingsRepository);

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
    // sendSupport
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
 *       - name: userId
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: User settings fetched successfully
 */
router.get("/:userId", (req, res, next) => controller.getSettings(req, res, next));

/**
 * @swagger
 * /api/v1/settings/{userId}/preferences:
 *   put:
 *     summary: Update account preferences (theme, language, data usage)
 *     tags: [Settings]
 */
router.put("/:userId/preferences", (req, res, next) => controller.updateProfileSettings(req, res, next));

/**
 * @swagger
 * /api/v1/settings/{userId}/notifications:
 *   put:
 *     summary: Update notification settings
 *     tags: [Settings]
 */
router.put("/:userId/notifications", (req, res, next) => controller.updateNotificationSettings(req, res, next));

/**
 * @swagger
 * /api/v1/settings/{userId}/privacy:
 *   patch:
 *     summary: Update privacy settings
 *     tags: [Settings]
 */
router.put("/:userId/privacy", (req, res, next) => controller.updatePrivacySettings(req, res, next));

// Account security
router.put("/:userId/security", (req, res, next) => controller.updateSecuritySettings(req, res, next));

/**
 * @swagger
 * /api/v1/settings/{userId}/restrictions:
 *   patch:
 *     summary: Update restriction settings (blocked accounts, limits)
 *     tags: [Settings]
 */
router.put("/:userId/restrictions", (req, res, next) => controller.updateRestrictions(req, res, next));

/**
 * @swagger
 * /api/v1/settings/{userId}/block:
 *   post:
 *     summary: Block another user
 *     tags: [Settings]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user performing the block
 *       - in: body
 *         name: data
 *         required: true
 *         description: User to block
 *         schema:
 *           type: object
 *           properties:
 *             targetUserId:
 *               type: string
 *               example: "678ffe2ba09d3a21e3bf45b9"
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
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user performing the unblock
 *       - in: body
 *         name: data
 *         required: true
 *         description: User to unblock
 *         schema:
 *           type: object
 *           properties:
 *             targetUserId:
 *               type: string
 *               example: "678ffe2ba09d3a21e3bf45b9"
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
 *     summary: Report a problem with screenshot + description
 *     tags: [Settings]
 */
router.post("/:userId/report", (req, res, next) => controller.reportProblem(req, res, next));

// Support
// router.post("/:userId/support", (req, res, next) => controller.support(req, res, next));

export { router as settingsRoutes };
