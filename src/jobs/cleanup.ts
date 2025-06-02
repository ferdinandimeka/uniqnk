import cron from "node-cron";
import { StoryModel } from "../infrastructure/models/StoryModel";
import { StoryViewModel } from "../infrastructure/models/StoryViewModel";

// Run this cleanup every hour
cron.schedule("0 * * * *", async () => {
    console.log("Running story cleanup...");

    try {
        // Find expired stories
        const now = new Date();
        const expiredStories = await StoryModel.find({ expiresAt: { $lt: now } }).select("_id");

        if (expiredStories.length > 0) {
            const storyIds = expiredStories.map(story => story._id);
            
            // Delete the expired stories
            await StoryModel.deleteMany({ _id: { $in: storyIds } });
            console.log(`Deleted ${storyIds.length} expired stories.`);

            // Delete associated views
            await StoryViewModel.deleteMany({ story: { $in: storyIds } });
            console.log(`Deleted views for ${storyIds.length} expired stories.`);
        }

    } catch (error) {
        console.error("Error during story cleanup:", error);
    }
});
