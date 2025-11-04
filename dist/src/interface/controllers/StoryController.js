"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryController = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
class StoryController {
    constructor(createStory, getStoryByid, getAllStory, updateStory, deleteStory, addReactions, removeReactions, deleteExpiredStorys, addView, getActiveStorys, markStoryAsView) {
        this.createStory = createStory;
        this.getStoryByid = getStoryByid;
        this.getAllStory = getAllStory;
        this.updateStory = updateStory;
        this.deleteStory = deleteStory;
        this.addReactions = addReactions;
        this.removeReactions = removeReactions;
        this.deleteExpiredStorys = deleteExpiredStorys;
        this.addView = addView;
        this.getActiveStorys = getActiveStorys;
        this.markStoryAsView = markStoryAsView;
    }
    async create(req, res, next) {
        try {
            const result = await this.createStory.execute(req.body);
            res.status(201).json(new apiResponse_1.ApiResponse(201, result, "Story created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async getStoryById(req, res, next) {
        try {
            const { id } = req.params;
            const result = await this.getStoryByid.execute(id);
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "Story fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async getAllStories(req, res, next) {
        try {
            const result = await this.getAllStory.execute();
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "Stories fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const result = await this.updateStory.execute(id, req.body);
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "Story updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            await this.deleteStory.execute(id);
            res.status(204).json(new apiResponse_1.ApiResponse(204, null, "Story deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteExpiredStories(req, res, next) {
        try {
            await this.deleteExpiredStorys.execute();
            res.status(204).json(new apiResponse_1.ApiResponse(204, null, "Expired stories deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async addReaction(req, res, next) {
        try {
            const { storyId } = req.params;
            const { userId, reactionType } = req.body;
            const result = await this.addReactions.execute(storyId, userId, reactionType);
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "Reaction added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async removeReaction(req, res, next) {
        try {
            const { storyId } = req.params;
            const { userId } = req.body;
            const result = await this.removeReactions.execute(storyId, userId);
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "Reaction removed successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async addViewer(req, res, next) {
        try {
            const { storyId } = req.params;
            const { userId } = req.body;
            const result = await this.addView.execute(storyId, userId);
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "View Added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async getActiveStories(req, res, next) {
        try {
            const result = await this.getActiveStorys.execute();
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "Active Stories fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async markStoryAsViewed(req, res, next) {
        try {
            const { storyId } = req.params;
            const { userId } = req.body;
            const result = await this.markStoryAsView.execute(storyId, userId);
            res.status(200).json(new apiResponse_1.ApiResponse(200, result, "Story marked as viewed successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StoryController = StoryController;
