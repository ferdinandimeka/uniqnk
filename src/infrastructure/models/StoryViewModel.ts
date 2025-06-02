import mongoose, { Schema, Document, Types } from "mongoose";

interface IStoryView extends Document {
    story: Types.ObjectId;
    user: Types.ObjectId;
    viewedAt: Date;
}

const StoryViewSchema = new Schema<IStoryView>({
    story: {
        type: Schema.Types.ObjectId,
        ref: "Story",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
});

const StoryViewModel = mongoose.model<IStoryView>("StoryView", StoryViewSchema);
export { StoryViewModel, IStoryView };
