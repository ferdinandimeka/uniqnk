// src/interface/controllers/SettingsController.ts

import { Request, Response, NextFunction } from "express";
import { GetSettingsByUserId } from "../../use-cases/settings/getSettingsByUserId";
import { UpdateProfilePreferences } from "../../use-cases/settings/updateProfilePreferences";
import { UpdateNotificationSettings } from "../../use-cases/settings/updateNotification";
import { UpdatePrivacySettings } from "../../use-cases/settings/updatePrivacy";
import { UpdateSecuritySettings } from "../../use-cases/settings/updateSecurity";
import { UpdateRestrictionSettings } from "../../use-cases/settings/updateRestrictions";
import { BlockUser } from "../../use-cases/settings/blockUser";
import { UnBlockUser } from "../../use-cases/settings/unBlockUser";
import { ReportProblem } from "../../use-cases/settings/reportProblem";
import { UpdateAuthSettings } from "../../use-cases/settings/updateAuth";
import { VerifyPinOrBiometric } from "../../use-cases/settings/verifyPinOrBiometric";
import { SecurityQuestion } from "../../use-cases/settings/securityQuestion";
import { Set2faAuth } from "../../use-cases/settings/2faAuth";
import { Verify2faAuth } from "../../use-cases/settings/verify2faAuth";

export class SettingsController {
    constructor(
        private getUserSettings: GetSettingsByUserId,
        private updateProfile: UpdateProfilePreferences,
        private updateNotifications: UpdateNotificationSettings,
        private updatePrivacy: UpdatePrivacySettings,
        private updateSecurity: UpdateSecuritySettings,
        private updateRestriction: UpdateRestrictionSettings,
        private blockUser: BlockUser,
        private unblockUser: UnBlockUser,
        private sendReport: ReportProblem,
        private updateAuth: UpdateAuthSettings,
        private verifyPinOrBiometric: VerifyPinOrBiometric,
        private securityQuestion: SecurityQuestion,
        private set2faAuth: Set2faAuth,
        private verify2faAuth: Verify2faAuth,
    ) {}

    async getSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const data = await this.getUserSettings.execute(userId);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async updateProfileSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.updateProfile.execute(req.params.userId, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async updateNotificationSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.updateNotifications.execute(req.params.userId, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async updatePrivacySettings(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.updatePrivacy.execute(req.params.userId, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async updateSecuritySettings(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.updateSecurity.execute(req.params.userId, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async updateRestrictions(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.updateRestriction.execute(req.params.userId, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async blockUserHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.blockUser.execute(req.params.userId, req.body.blockUserId);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async unblockUserHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.unblockUser.execute(req.params.userId, req.body.unblockUserId);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async reportProblem(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.sendReport.execute(req.params.userId, req.body.message);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async updateAuthSettings(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.updateAuth.execute(req.params.userId, req.body);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async verifyPinOrBiometricHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const isValid = await this.verifyPinOrBiometric.execute(req.params.userId);
            res.json({ success: true, valid: isValid });
        } catch (error) {
            next(error);
        }
    }

    async setupSecurityQuestion(req: Request, res: Response, next: NextFunction) {
        try {
            await this.securityQuestion.execute(req.params.userId, req.body.questionId, req.body.answer);
            res.json({ success: true });
        } catch (error) {
            next(error);
        }
    }

    async setup2faAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await this.set2faAuth.execute(req.params.userId);
            res.json({ success: true, data });
        } catch (error) {
            next(error);
        }
    }

    async verify2FaAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const isValid = await this.verify2faAuth.execute(req.params.userId, req.body.token);
            res.json({ success: true, valid: isValid });
        } catch (error) {
            next(error);
        }
    }
}
