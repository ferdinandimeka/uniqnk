// import { PostRepository } from "../../domain/interfaces/postRepository";
// import { Post } from "../../domain/entities/Post";
// import mongoose from "mongoose";

// export class AddLike {
//     constructor(private postRepository: PostRepository) {}

//     async execute(postId: string, userId: string): Promise<Post | null> {
//         const post = await this.postRepository.findById(postId);
//         console.log("post: ", post)
//         if (!post) {
//             return null;
//         }
//         post.likes = post.likes.map((u: any) => {
//             if (u._id) return u._id; // convert populated user objects
//             return  new mongoose.Types.ObjectId(u);
//         });

//         if (post.likes.includes(userId)) {
//             return post; // User has already liked the post
//         }

//         post.likes.push(userId);
//         return await this.postRepository.update(post);
//     }
// }

import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";
import mongoose from "mongoose";

export class AddLike {
  constructor(private postRepository: PostRepository) {}

  async execute(postId: string, userId: string): Promise<Post | null> {
    return this.postRepository.addLike(postId, userId);
  }
}

