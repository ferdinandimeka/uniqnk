"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const StoryModel_1 = require("../infrastructure/models/StoryModel");
const StoryViewModel_1 = require("../infrastructure/models/StoryViewModel");
// Run this cleanup every hour
node_cron_1.default.schedule("0 * * * *", async () => {
    console.log("Running story cleanup...");
    try {
        // Find expired stories
        const now = new Date();
        const expiredStories = await StoryModel_1.StoryModel.find({ expiresAt: { $lt: now } }).select("_id");
        if (expiredStories.length > 0) {
            const storyIds = expiredStories.map(story => story._id);
            // Delete the expired stories
            await StoryModel_1.StoryModel.deleteMany({ _id: { $in: storyIds } });
            console.log(`Deleted ${storyIds.length} expired stories.`);
            // Delete associated views
            await StoryViewModel_1.StoryViewModel.deleteMany({ story: { $in: storyIds } });
            console.log(`Deleted views for ${storyIds.length} expired stories.`);
        }
    }
    catch (error) {
        console.error("Error during story cleanup:", error);
    }
});
