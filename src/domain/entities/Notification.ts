import { Types } from "mongoose";

export class Notification {
    constructor(
        public readonly _id: Types.ObjectId,
        public user: Types.ObjectId,
        public type: string,
        public actors: Types.ObjectId[] = [],
        public content: string,
        public count: number,
        public post?: Types.ObjectId,
        public comment?: Types.ObjectId,
        public isRead: boolean = false,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) {
        // Validate type
        if (!type || typeof type !== "string" || type.trim().length === 0) {
            throw new Error("Notification type is required and must be a non-empty string");
        }
        // Validate content        if (!content || typeof content !== "string" || content.trim().length === 0) {
        throw new Error("Content is required and must be a non-empty string");
    }
}