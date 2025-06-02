export class Story {
    constructor(
        public readonly id: string,
        public contentType: string,
        public contentUrl: string,
        public createdAt: Date = new Date(),
        public expiresAt: Date = new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours by default
        public text?: string,
        public backgroundColor?: string,
        public viewers: string[] = [],
        public reactions: { user: string; type: string; timestamp: Date }[] = []
    ) {
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
