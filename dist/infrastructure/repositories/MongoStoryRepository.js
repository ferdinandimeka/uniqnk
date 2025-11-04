"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoStoryRepository = void 0;
const apiError_1 = require("../../utils/apiError");
const StoryModel_1 = require("../models/StoryModel");
const StoryViewModel_1 = require("../models/StoryViewModel");
const mongoose_1 = __importDefault(require("mongoose"));
class MongoStoryRepository {
    async findAll() {
        const stories = await StoryModel_1.StoryModel.find()
            .populate("user", "username profilePicture") // populate user fields
            .sort({ createdAt: -1 }); // optional: newest first
        return stories.map((story) => this.toStory(story));
    }
    async findById(id) {
        const story = await StoryModel_1.StoryModel.findById(id);
        if (!story) {
            throw new apiError_1.ApiError(404, "Story not found");
        }
        return this.toStory(story);
    }
    async findByUserId(userId) {
        return StoryModel_1.StoryModel.find({ userId });
    }
    async create(story) {
        const newStory = new StoryModel_1.StoryModel(story);
        const stories = await newStory.save();
        return this.toStory(stories);
    }
    async update(story) {
        const updatedStory = await StoryModel_1.StoryModel.findByIdAndUpdate(story.id, story, { new: true });
        if (!updatedStory) {
            throw new apiError_1.ApiError(404, "Story not found");
        }
        await updatedStory.save();
    }
    async delete(id) {
        const deletedStory = await StoryModel_1.StoryModel.findByIdAndDelete(id);
        if (!deletedStory) {
            throw new apiError_1.ApiError(404, "Story not found");
        }
    }
    async deleteExpiredStories() {
        const currentDate = new Date();
        await StoryModel_1.StoryModel.deleteMany({ expirationDate: { $lt: currentDate } });
    }
    async addReaction(storyId, userId, reactionType) {
        const story = await StoryModel_1.StoryModel.findById(storyId);
        if (!story) {
            throw new apiError_1.ApiError(404, "Story not found");
        }
        if (!story.reactions) {
            story.reactions = [];
        }
        const existingReaction = story.reactions.find((reaction) => reaction.user.toString() === userId);
        if (existingReaction) {
            existingReaction.type = reactionType;
        }
        else {
            story.reactions.push({
                user: new mongoose_1.default.Types.ObjectId(userId), type: reactionType,
                timestamp: new Date(),
            });
        }
        await story.save();
        return this.toStory(story);
    }
    async removeReaction(storyId, userId) {
        const story = await StoryModel_1.StoryModel.findById(storyId);
        if (!story) {
            throw new apiError_1.ApiError(404, "Story not found");
        }
        if (!story.reactions) {
            story.reactions = [];
        }
        const reactionIndex = story.reactions.findIndex((reaction) => reaction.user.toString() === userId);
        if (reactionIndex !== -1) {
            story.reactions.splice(reactionIndex, 1);
        }
        await story.save();
        return this.toStory(story);
    }
    async addViewer(storyId, userId) {
        const story = await StoryModel_1.StoryModel.findById(storyId);
        if (!story) {
            throw new apiError_1.ApiError(404, "Story not found");
        }
        if (!story.viewers) {
            story.viewers = [];
        }
        const existingViewer = story.viewers.find((viewer) => viewer.toString() === userId);
        if (!existingViewer) {
            story.viewers.push(new mongoose_1.default.Types.ObjectId(userId));
        }
        await story.save();
        return this.toStory(story);
    }
    async getActiveStories() {
        // retreive stories that have not expired
        const currentDate = new Date();
        const stories = await StoryModel_1.StoryModel.find({ expiresAt: { $gt: currentDate } });
        return stories.map((story) => this.toStory(story));
    }
    async markStoryAsViewed(storyId, userId) {
        const story = await StoryModel_1.StoryModel.findById(storyId);
        if (!story) {
            throw new apiError_1.ApiError(404, "Story not found");
        }
        // Check if the user has already viewed the story
        const existingView = await StoryViewModel_1.StoryViewModel.findOne({
            story: storyId,
            user: userId
        });
        if (!existingView) {
            // Create a new view record
            const newView = new StoryViewModel_1.StoryViewModel({
                story: storyId,
                user: userId,
                viewedAt: new Date()
            });
            await newView.save();
        }
    }
    toStory(storyDoc) {
        const userObj = storyDoc.toObject();
        return {
            ...userObj,
            id: userObj._id.toString(), // map MongoDB _id to your domain id
        };
    }
}
exports.MongoStoryRepository = MongoStoryRepository;
