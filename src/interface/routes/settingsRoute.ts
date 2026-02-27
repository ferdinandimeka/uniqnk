// src/interface/routes/settingsRoutes.ts

import { Router } from "express";
import { MongoSettingsRepository } from "../../infrastructure/repositories/MongoSettingsRepository";

// Use-cases
import { GetSettingsByUserId } from "../../use-cases/settings/getSettingsByUserId";
import { UpdateProfilePreferences } from "../../use-cases/settings/updateProfilePreferences";
import { UpdateNotificationSettings } from "../../use-cases/settings/updateNotification";
import { UpdatePrivacySettings } from "../../use-cases/settings/updatePrivacy";
import { UpdateSecuritySettings } from "../../use-cases/settings/updateSecurity";
import { RestrictAccount } from "../../use-cases/settings/restrictAccount";
import { UnRestrictAccount } from "../../use-cases/settings/unRestrictAccount";
import { BlockUser } from "../../use-cases/settings/blockUser";
import { UnBlockUser } from "../../use-cases/settings/unBlockUser";
import { ReportProblem } from "../../use-cases/settings/reportProblem";
import { UpdateAuthSettings } from "../../use-cases/settings/updateAuth";
import { VerifyPinOrBiometric } from "../../use-cases/settings/verifyPinOrBiometric";
import { SecurityQuestion } from "../../use-cases/settings/securityQuestion";
import { Set2faAuth } from "../../use-cases/settings/2faAuth";
import { Verify2faAuth } from "../../use-cases/settings/verify2faAuth";
import { SettingsController } from "../controllers/SettingsController";
import {  EnableAccount } from "../../use-cases/settings/enableAccount";
import { DisableAccount } from "../../use-cases/settings/disableAccount";
import { DeactivateAccount } from "../../use-cases/settings/deactivateAccount";
import { ReactivateAccount } from "../../use-cases/settings/activateAccount";

const router = Router();
const settingsRepository = new MongoSettingsRepository();

// Instantiate use-cases
const getSettings = new GetSettingsByUserId(settingsRepository);
const updateProfile = new UpdateProfilePreferences(settingsRepository);
const updateNotifications = new UpdateNotificationSettings(settingsRepository);
const updatePrivacy = new UpdatePrivacySettings(settingsRepository);
const updateSecurity = new UpdateSecuritySettings(settingsRepository);
const restrictAccount = new RestrictAccount(settingsRepository);
const unRestrictAccount = new UnRestrictAccount(settingsRepository);
const blockUser = new BlockUser(settingsRepository);
const unblockUser = new UnBlockUser(settingsRepository);
const sendReport = new ReportProblem(settingsRepository);
const updateAuth = new UpdateAuthSettings(settingsRepository);
const verifyPinOrBiometric = new VerifyPinOrBiometric(settingsRepository);
const securityQuestion = new SecurityQuestion(settingsRepository);
const set2faAuth = new Set2faAuth(settingsRepository);
const verify2faAuth = new Verify2faAuth(settingsRepository);
const enableAccount = new EnableAccount(settingsRepository);
const disableAccount = new DisableAccount(settingsRepository);
const deactivateAccount = new DeactivateAccount(settingsRepository);
const reactivateAccount = new ReactivateAccount(settingsRepository);

// Controller
const controller = new SettingsController(
    getSettings,
    updateProfile,
    updateNotifications,
    updatePrivacy,
    updateSecurity,
    restrictAccount,
    unRestrictAccount,
    blockUser,
    unblockUser,
    sendReport,
    updateAuth,
    verifyPinOrBiometric,
    securityQuestion,
    set2faAuth,
    verify2faAuth,
    enableAccount,
    disableAccount,
    deactivateAccount,
    reactivateAccount
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
 *               status:
 *                 type: boolean
 *                 example: false
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
 * /api/v1/settings/{userId}/restrict:
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
 *               reason:
 *                 required: false 
 *                 type: string
 *                 example: "User is being abusive"
 *     responses:
 *       200:
 *         description: Restrict Account
 */
router.put("/:userId/restrict", (req, res, next) =>
    controller.restrictAccounts(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/restrict:
 *   put:
 *     summary: Update restriction settings (blocked accounts, limits)
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Unrestrict Account
 */
router.put("/:userId/unrestrict", (req, res, next) =>
    controller.unRestrictAccounts(req, res, next)
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

/**
 * @swagger
 * /api/v1/settings/{userId}/biometric-auth:
 *   put:
 *     summary: Update authentication settings
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
 *               twoFactorAuthEnabled:
 *                 type: boolean
 *                 example: true
 *               password:
 *                 type: string
 *                 example: "newSecurePassword123"
 *               emailVerificationRequired:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Authentication settings updated successfully
 */
router.put("/:userId/biometric-auth", (req, res, next) =>
    controller.updateAuthSettings(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/verify-pin-biometric:
 *   get:
 *     summary: Verify if user has PIN or biometric authentication enabled
 *     tags: [Settings]
 *     parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *   responses:
 *    200:
 *    description: Verification result
 */
router.get("/:userId/verify-pin-biometric", (req, res, next) =>
    controller.verifyPinOrBiometricHandler(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/2fa/verify:
 *   post:
 *     summary: Verify 2FA token
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
 *             required: [token]
 *             properties:
 *               token:
 *                 type: string
 *                 example: "123456"
 */
router.post("/:userId/2fa/verify", (req, res, next) =>
    controller.verify2FaAuth(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/security-question:
 *   post:
 *     summary: Setup security question
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
 *             required: [questionId, answer]
 *             properties:
 *               questionId:
 *                 type: string
 *                 example: "pet"
 *               answer:
 *                 type: string
 *                 example: "My favorite color is blue."
 */
router.post("/:userId/security-question", (req, res, next) =>
    controller.setupSecurityQuestion(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/2fa/setup:
 *   post:
 *     summary: Setup 2FA for a user
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: 2FA setup successful
 */
router.post("/:userId/2fa/setup", (req, res, next) =>
    controller.setup2faAuth(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/enable-account:
 *   post:
 *     summary: Enable user account
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *         description: Account enabled successfully
 */
router.post("/:userId/enable-account", (req, res, next) =>
    controller.enableAccountHandler(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/disable-account:
 *   post:
 *     summary: Disable user account with reason
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *           type: object
 *           required: [reason]
 *           properties:
 *             reason:
 *               type: string
 *               example: "User requested account disable due to privacy concerns."
 *     responses:
 *           200:
 *             description: Account disabled successfully
 */
router.post("/:userId/disable-account", (req, res, next) =>
    controller.disableAccountHandler(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/deactivate-account:
 *   post:
 *     summary: Deactivate user account
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
 *             required: [reason]
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "User requested account deactivation."
 *     responses:
 *           200:
 *             description: Account deactivated successfully
 */
router.post("/:userId/deactivate-account", (req, res, next) =>
    controller.deactivateAccountHandler(req, res, next)
);

/**
 * @swagger
 * /api/v1/settings/{userId}/reactivate-account:
 *   post:
 *     summary: Reactivate user account
 *     tags: [Settings]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *     responses:
 *       200:
 *        description: Account reactivated successfully
 */
router.post("/:userId/reactivate-account", (req, res, next) =>
    controller.reactivateAccountHandler(req, res, next)
);

export { router as settingsRoutes };
