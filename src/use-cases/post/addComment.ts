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

//   async execute(postId: string, userId: string, comment: string): Promise<Post | null> {
//     if (!mongoose.Types.ObjectId.isValid(postId)) {
//       throw new Error("Invalid post ID");
//     }

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       throw new Error("Invalid user ID");
//     }

//     // ✅ Find the post
//     const post = await this.postRepository.findById(postId);
//     if (!post) return null;

//      // ✅ Check if user exists
//     const userExists = await UserModel.findById(userId);
//     if (!userExists) {
//       throw new Error("User not found");
//     }

//     // ✅ Create a new comment
//     const newComment = await this.commentRepository.create({
//       post: postId,
//       user: userId,
//       content: comment,
//     });
//     console.log("New Comment Created:", newComment);
//     console.log("Post Before Update:", post);

//     // ✅ Add the comment to the post
//     post.comments.push(String(newComment._id));
//     await this.postRepository.update(post);
//      console.log("Post After Update:", post);
//     // ✅ Re-fetch the post with populated comments and users
//     const populatedPost = await PostModel.findById(postId)
//       .populate({
//         path: "comments",
//         populate: {
//           path: "user",
//           select: "username avatar",
//         },
//       })
//       .lean()
//       .exec();

//     return populatedPost as unknown as Post;
//   }
// }


async execute(postId: string, userId: string, comment: string): Promise<Post | null> {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error("Invalid post ID");
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  // ✅ Find the post (ensure it's not populated)
  const post = await this.postRepository.findById(postId);
  if (!post) return null;

  // ✅ Ensure user exists
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

  // console.log("New Comment Created:", newComment);
  // console.log("Post Before Update:", post);

  // ✅ Normalize comments array to ObjectIds
  post.comments = post.comments.map((c: any) => {
    if (c._id) return c._id; // convert populated comment objects
    return new mongoose.Types.ObjectId(c);
  });
  // console.log("Normalized Comments:", post.comments);

  // ✅ Add the new comment to the comments array in MongoDB
  await PostModel.findByIdAndUpdate(
    postId,
    {
      $push: { comments: newComment._id },
      $inc: { num_comments: 1 }, // optional: keeps num_comments accurate
      updatedAt: new Date(),
    },
    { new: true }
  );


  console.log("Post After Update:", post);

  // ✅ Fetch post with populated comments and users
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
