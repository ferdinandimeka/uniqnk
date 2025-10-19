import { CommentRepository } from "../../domain/interfaces/commentRepository";
import { CommentModel, IComment } from "../models/CommentModel";
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
    parentCommentId: string,
    userId: string,
    postId: string,
    content: string
  ) {
    const parentComment = await CommentModel.findById(parentCommentId);
    if (!parentComment) throw new Error("Parent comment not found");

    const reply = await this.create({
      post: postId,
      user: userId,
      content,
      parentComment: parentCommentId,
    });
    parentComment.replies.push(new Types.ObjectId(reply._id as string));
    await parentComment.save();

    return reply;
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
}
