import { CreateStory } from "../../use-cases/story/createStory";
import { GetStoryById } from "../../use-cases/story/getStoryById";
import { GetAllStories } from "../../use-cases/story/getAllStories";
import { DeleteStory } from "../../use-cases/story/deleteStory";
import { AddReaction } from "../../use-cases/story/addReaction";
import { RemoveReaction } from "../../use-cases/story/removeReaction";
import { AddViewer } from "../../use-cases/story/addViewer";
import { GetActiveStories } from "../../use-cases/story/getActiveStories";
import { DeleteExpiredStories } from "../../use-cases/story/deleteExpiredStories";
import { UpdateStory } from "../../use-cases/story/updateStory";
import { MarkStoryAsViewed } from "../../use-cases/story/markStoryAsViewed";
import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from "../../utils/apiResponse";

export class StoryController {
    constructor(
        private createStory: CreateStory,
        private getStoryByid: GetStoryById,
        private getAllStory: GetAllStories,
        private updateStory: UpdateStory,
        private deleteStory: DeleteStory,
        private addReactions: AddReaction,
        private removeReactions: RemoveReaction,
        private deleteExpiredStorys: DeleteExpiredStories,
        private addView: AddViewer,
        private getActiveStorys: GetActiveStories,
        private markStoryAsView: MarkStoryAsViewed
    ) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.createStory.execute(req.body);
            
            res.status(201).json(new ApiResponse(201, result, "Story created successfully"));
        } catch (error) {
            next(error);
        }
    }

    async getStoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const result = await this.getStoryByid.execute(id);
            res.status(200).json(new ApiResponse(200, result, "Story fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    async getAllStories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.getAllStory.execute();
            res.status(200).json(new ApiResponse(200, result, "Stories fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const result = await this.updateStory.execute(id, req.body);
            res.status(200).json(new ApiResponse(200, result, "Story updated successfully"));
        } catch (error) {
            next(error);
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            await this.deleteStory.execute(id);
            res.status(204).json(new ApiResponse(204, null, "Story deleted successfully"));
        } catch (error) {
            next(error);
        }
    }

    async deleteExpiredStories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.deleteExpiredStorys.execute();
            res.status(204).json(new ApiResponse(204, null, "Expired stories deleted successfully"));
        } catch (error) {
            next(error);
        }
    }

    async addReaction(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { storyId } = req.params;
            const { userId, reactionType } = req.body;
            const result = await this.addReactions.execute(storyId, userId, reactionType);
            res.status(200).json(new ApiResponse(200, result, "Reaction added successfully"));
        } catch (error) {
            next(error);
        }
    }

    async removeReaction(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { storyId } = req.params;
            const { userId } = req.body;
            const result = await this.removeReactions.execute(storyId, userId);
            res.status(200).json(new ApiResponse(200, result, "Reaction removed successfully"));
        } catch (error) {
            next(error);
        }
    }

    async addViewer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const { storyId } = req.params;
            const { userId } = req.body;
            const result = await this.addView.execute(storyId, userId)
            res.status(200).json(new ApiResponse(200, result, "View Added successfully"));
        } catch (error) {
            next(error)
        }
    }

     async getActiveStories(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.getActiveStorys.execute();
            res.status(200).json(new ApiResponse(200, result, "Active Stories fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    async markStoryAsViewed(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { storyId } = req.params;
            const { userId } = req.body;
            const result = await this.markStoryAsView.execute(storyId, userId);
            res.status(200).json(new ApiResponse(200, result, "Story marked as viewed successfully"));
        } catch (error) {
            next(error);
        }
    }
}
