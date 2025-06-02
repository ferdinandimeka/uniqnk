export class Post {
    constructor(
        public readonly id: string,
        public user: string,
        public content: string,
        public mediaUrls: string[] = [],
        public likes: string[] = [],
        public comments: string[] = [],
        public shares: string[] = [],
        public reactions: {
            like: number;
            love: number;
            haha: number;
            wow: number;
            sad: number;
            angry: number;
        } = {
            like: 0,
            love: 0,
            haha: 0,
            wow: 0,
            sad: 0,
            angry: 0
        },
        public rank: number = 0,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {
        // Validate user ID
        if (!user || typeof user !== "string" || user.trim().length === 0) {
            throw new Error("User ID is required and must be a non-empty string");
        }

        // Validate content
        if (!content || typeof content !== "string" || content.trim().length === 0) {
            throw new Error("Content is required and must be a non-empty string");
        }

        // Validate media URLs
        for (const url of mediaUrls) {
            if (!/^https?:\/\/\S+\.\S+$/.test(url)) {
                throw new Error(`Invalid media URL: ${url}`);
            }
        }

        // Ensure updatedAt is not before createdAt
        if (updatedAt < createdAt) {
            throw new Error("UpdatedAt cannot be before CreatedAt");
        }
    }

    addLike(userId: string) {
        if (!this.likes.includes(userId)) {
            this.likes.push(userId);
            this.updatedAt = new Date();
        }
    }

    addComment(commentId: string) {
        this.comments.push(commentId);
        this.updatedAt = new Date();
    }

    addShare(userId: string) {
        if (!this.shares.includes(userId)) {
            this.shares.push(userId);
            this.updatedAt = new Date();
        }
    }

    addReaction(userId: string, type: keyof typeof this.reactions) {
        if (this.reactions[type] !== undefined) {
            this.reactions[type]++;
            this.updatedAt = new Date();
        } else {
            throw new Error(`Invalid reaction type. Allowed types are: ${Object.keys(this.reactions).join(", ")}`);
        }
    }
}
