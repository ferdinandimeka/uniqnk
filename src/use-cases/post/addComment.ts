import mongoose from "mongoose";
import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";
import { CommentRepository } from "../../domain/interfaces/commentRepository";

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

    // ✅ Create new comment
    const newComment = await this.commentRepository.create({
      post: postId,
      user: userId,
      content: comment,
    });

    // ✅ Push the ObjectId of the comment as a string
    post.comments.push(String(newComment._id));

    // ✅ Save updated post
    const updatedPost = await this.postRepository.update(post);

    return updatedPost;
  }
}
