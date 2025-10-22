import mongoose from "mongoose";
import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";
import { CommentRepository } from "../../domain/interfaces/commentRepository";
import { PostModel } from "../../infrastructure/models/PostModel"; // <-- make sure this path matches your structure
import { UserModel } from "../../infrastructure/models/UserModel";

export class AddComment {
  constructor(
    private postRepository: PostRepository,
    private commentRepository: CommentRepository
  ) {}

  async execute(postId: string, userId: string, comment: string): Promise<Post | null> {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    // ✅ Find the post
    const post = await this.postRepository.findById(postId);
    if (!post) return null;

     // ✅ Check if user exists
    const userExists = await UserModel.findById(userId);
    if (!userExists) {
      throw new Error("User not found");
    }

    // ✅ Create a new comment
    const newComment = await this.commentRepository.create({
      post: postId,
      user: userId,
      content: comment,
    });

    // ✅ Add the comment to the post
    post.comments.push(String(newComment._id));
    await this.postRepository.update(post);

    // ✅ Re-fetch the post with populated comments and users
    const populatedPost = await PostModel.findById(postId)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username avatar",
        },
      })
      .lean()
      .exec();

    return populatedPost as unknown as Post;
  }
}
