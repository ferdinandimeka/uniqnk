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

// Get settings
router.get("/:userId", (req, res, next) => controller.getSettings(req, res, next));

// Profile settings
router.put("/:userId/profile", (req, res, next) => controller.updateProfileSettings(req, res, next));

// Notification settings
router.put("/:userId/notifications", (req, res, next) => controller.updateNotificationSettings(req, res, next));

// Privacy settings
router.put("/:userId/privacy", (req, res, next) => controller.updatePrivacySettings(req, res, next));

// Account security
router.put("/:userId/security", (req, res, next) => controller.updateSecuritySettings(req, res, next));

// Restrictions
router.put("/:userId/restrictions", (req, res, next) => controller.updateRestrictions(req, res, next));

// Block user
router.post("/:userId/block", (req, res, next) => controller.blockUserHandler(req, res, next));

// Unblock user
router.post("/:userId/unblock", (req, res, next) => controller.unblockUserHandler(req, res, next));

// Report a problem
router.post("/:userId/report", (req, res, next) => controller.reportProblem(req, res, next));

// Support
// router.post("/:userId/support", (req, res, next) => controller.support(req, res, next));

export { router as settingsRoutes };
