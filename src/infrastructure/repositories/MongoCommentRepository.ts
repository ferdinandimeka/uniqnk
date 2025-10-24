import { CommentRepository } from "../../domain/interfaces/commentRepository";
import { CommentModel, IComment } from "../models/CommentModel";
import { PostModel } from "../models/PostModel";
import { Types } from "mongoose";

export class MongoCommentRepository implements CommentRepository {
  /**
   * Create a new comment document.
   */
  async create(data: {
    post: string;
    user: string;
    content: string;
    parentComment?: string;
  }): Promise<IComment> {
    const newComment = new CommentModel({
      post: data.post,
      user: data.user,
      content: data.content,
      parentComment: data.parentComment,
    });

    await newComment.save();
    return newComment;
  }

  /**
   * reply to comment.
   */
   async replyToComment(
    commentId: string,
    userId: string,
    postId: string,
    content: string
  ) {
    const parentComment = await CommentModel.findById(commentId);
    if (!parentComment) throw new Error("Parent comment not found");

    const reply = await this.create({
      post: postId,
      user: userId,
      content,
      parentComment: commentId,
    });
    parentComment.replies.push(new Types.ObjectId(reply._id as string));
    await parentComment.save();

    // 4️⃣ Optionally update the post (if you want `num_comments` to increase)
    await PostModel.findByIdAndUpdate(postId, { $inc: { num_comments: 1 } });

    // 5️⃣ Return reply populated for frontend
    return await CommentModel.findById(reply._id)
      .populate("user", "username")
      .populate("parentComment", "content")
  }

  /**
   * Find a comment by its ID.
   */
  async findById(id: string): Promise<IComment | null> {
    return CommentModel.findById(id)
      .populate("post")
      .populate("user", "username profilePicture")
      .populate("replies")
      .exec();
  }

  /**
   * Get all comments for a specific post.
   */
  async findByPostId(postId: string): Promise<IComment[]> {
    return CommentModel.find({ post: postId })
      .populate("user", "username profilePicture")
      .populate({
        path: "replies",
        populate: { path: "user", select: "username profilePicture" },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  /**
   * Delete a comment by ID.
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await CommentModel.findByIdAndDelete(id);
    return !!result;
  }

  /**
   * Like a comment.
   */
  async likeComment(commentId: string, userId: string): Promise<IComment | null> {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return null;

    if (!comment.likes.includes(new Types.ObjectId(userId))) {
      comment.likes.push(new Types.ObjectId(userId));
      await comment.save();
    }

    return comment;
  }

  /**
   * Unlike a comment.
   */
  async unlikeComment(commentId: string, userId: string): Promise<IComment | null> {
    const comment = await CommentModel.findById(commentId);
    if (!comment) return null;

    comment.likes = comment.likes.filter((id) => String(id) !== userId);
    await comment.save();

    return comment;
  }

}
