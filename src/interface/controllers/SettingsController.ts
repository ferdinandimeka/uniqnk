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
// import { SendSupportRequest } from "../../use-cases/settings/sendSupportRequest";

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
        // private sendSupport: SendSupportRequest,
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

    // async support(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const data = await this.sendSupport.execute(req.params.userId, req.body.message);
    //         res.json({ success: true, data });
    //     } catch (error) {
    //         next(error);
    //     }
    // }
}
