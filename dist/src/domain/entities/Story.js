"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Story = void 0;
class Story {
    constructor(id, contentType, contentUrl, createdAt = new Date(), expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours by default
    text, backgroundColor, viewers = [], reactions = []) {
        this.id = id;
        this.contentType = contentType;
        this.contentUrl = contentUrl;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.text = text;
        this.backgroundColor = backgroundColor;
        this.viewers = viewers;
        this.reactions = reactions;
        // Validate contentType
        const allowedContentTypes = ["image", "video", "text"];
        if (!allowedContentTypes.includes(contentType)) {
            throw new Error(`Invalid content type. Allowed types are: ${allowedContentTypes.join(", ")}`);
        }
        // Validate URLs
        if (!/^https?:\/\/\S+\.\S+$/.test(contentUrl)) {
            throw new Error("Invalid content URL");
        }
        // Set default background color if not provided (only for text stories)
        if (contentType === "text" && !backgroundColor) {
            this.backgroundColor = "#FFFFFF";
        }
        // Ensure expiresAt is in the future
        if (expiresAt <= createdAt) {
            throw new Error("ExpiresAt must be a future date");
        }
    }
}
exports.Story = Story;
