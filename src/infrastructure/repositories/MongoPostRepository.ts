import { Post } from "../../domain/entities/Post";
import { PostRepository } from "../../domain/interfaces/postRepository";
import { PostModel } from "../models/PostModel";
import { CommentModel } from "../models/CommentModel";
import { rankPosts } from "../../utils/ranking";
import mongoose from "mongoose"

export class MongoPostRepository implements PostRepository {
    async findAll(): Promise<Post[]> {
        const posts = await PostModel.find();
        return posts.map(post => this.toPost(post));
    }

    async findById(id: string): Promise<Post | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid post ID format');
        }
        // const post = await PostModel.findById(id);
        // Re-fetch with populated comments AFTER saving
        const populatedPost = await PostModel.findById(id)
            .populate({
                path: "comments",
                populate: { path: "user", select: "username avatar" },
            })
            .lean(); // returns plain JS object, no need for `toPost`

        if (!populatedPost) {
            return null;
        }

        const postWithCounts = {
            ...populatedPost,
            num_comments: Array.isArray(populatedPost.comments) ? populatedPost.comments.length : 0,
        };

        return postWithCounts as unknown as Post;
    }

    async findByUserId(userId: string): Promise<Post[]> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }
        const posts = await PostModel.find({ userId });
        return posts.map(post => this.toPost(post));
    }

    async create(post: Post): Promise<Post> {
        const newPost = new PostModel(post);
        const savedPost = await newPost.save();
        return this.toPost(savedPost);
    }

    async update(post: Post): Promise<Post | null> {
        const newPost = await PostModel.findByIdAndUpdate(post.id, post, { new: true });
        return this.toPost(newPost);
    }

    async delete(id: string): Promise<void> {
        await PostModel.findByIdAndDelete(id);
    }

    async addLike(postId: string, userId: string): Promise<Post | null> {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!post.likes) {
            post.likes = [];
        }
        if (!post.likes.includes(new mongoose.Types.ObjectId(userId))) {
            post.likes.push(new mongoose.Types.ObjectId(userId));
            await post.save();
        }
        return this.toPost(post);
    }

    // async removeLike(postId: string, userId: string): Promise<Post | null> {
    //     const post = await PostModel.findById(postId);
    //     const userObjectId = new mongoose.Types.ObjectId(userId);

    //     if (!mongoose.Types.ObjectId.isValid(userId)) {
    //         throw new Error('Invalid user ID format');
    //     }

    //     if (!mongoose.Types.ObjectId.isValid(postId)) {
    //         throw new Error('Invalid post ID format');
    //     }

    //     if (!post) {
    //         throw new Error('Post not found');
    //     }
    //     if (post.likes && post.likes.includes(userObjectId)) {
    //         // Remove the like from the post
    //         post.likes = post.likes.filter((like: mongoose.Types.ObjectId) => like.toString() !== userObjectId.toString());
    //         await post.save();
    //     }
    //     return this.toPost(post);
    // }

   async removeLike(postId: string, userId: string): Promise<Post | null> {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new Error("Invalid post ID format");
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format");
  }

  const post = await PostModel.findById(postId);
  if (!post) throw new Error("Post not found");

  const beforeCount = post.likes.length;

  // ✅ Safely filter by string value
  const updatedLikes = post.likes.filter(
    (like) => like.toString() !== userId.toString()
  );

  post.set("likes", updatedLikes); // 🔥 ensures overwrite
  await post.save({ validateBeforeSave: false });

  console.log(`Removed ${beforeCount - post.likes.length} likes`);

  return this.toPost(post);
}



    
    // async addComment(postId: string, commentId: string): Promise<Post | null> {
    //     const post = await PostModel.findById(postId);
    //     const commentObjectId = new mongoose.Types.ObjectId(commentId);

    //     if (!mongoose.Types.ObjectId.isValid(postId)) {
    //         throw new Error('Invalid post ID format');
    //     }
        
    //     if (!post) {
    //         throw new Error('Post not found');
    //     }
    //     if (!post.comments) {
    //         post.comments = [];
    //     }
    //     if (!post.comments.includes(commentObjectId)) {
    //         post.comments.push(commentObjectId);
    //         await post.save();
    //     }
    //     return this.toPost(post);
    // }

   async addComment(postId: string, commentId: string): Promise<Post | null> {
    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new Error("Invalid post ID format");
    }
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new Error("Invalid comment ID format");
    }

    // Fetch Post
    const post = await PostModel.findById(postId);
    if (!post) {
        throw new Error("Post not found");
    }

    // ✅ Verify comment exists before pushing
    const commentExists = await CommentModel.findById(commentId);
    if (!commentExists) {
        throw new Error("Comment not found or failed to create");
    }

    const commentObjectId = new mongoose.Types.ObjectId(commentId);

    // Initialize comments array if missing
    if (!Array.isArray(post.comments)) {
        post.comments = [];
    }

    // Avoid duplicates
    const alreadyHasComment = post.comments.some(
        (c: any) => c.toString() === commentObjectId.toString()
    );
    if (!alreadyHasComment) {
        post.comments.push(commentObjectId);
        await post.save();
    }

    // ✅ Re-fetch with populated comments & users
    const populatedPost = await PostModel.findById(postId)
    //    .populate({
    //         path: "comments",
    //         match: { user: { $ne: null } }, // filter out comments without valid user
    //         populate: {
    //             path: "user",
    //             match: { _id: { $ne: null } }, // filter out null users
    //             select: "username avatar",
    //         },
    //     })

    //     .lean();

    if (!populatedPost) {
        throw new Error("Failed to populate post after adding comment");
    }

    return populatedPost as unknown as Post;
}



    async removeComment(postId: string, commentId: string): Promise<Post | null> {
        const post = await PostModel.findById(postId);
        const commentObjectId = new mongoose.Types.ObjectId(commentId);

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error('Invalid post ID format');
        }

        if (!post) {
            throw new Error('Post not found');
        }
        if (post.comments && post.comments.includes(commentObjectId)) {
            post.comments = post.comments.filter((comment: mongoose.Types.ObjectId) => comment !== commentObjectId);
            await post.save();
        }
        return this.toPost(post);
    }

    async addShare(postId: string, userId: string): Promise<Post | null> {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        if (!post.shares) {
            post.shares = [];
        }
        if (!post.shares.includes(new mongoose.Types.ObjectId(userId))) {
            post.shares.push(new mongoose.Types.ObjectId(userId));
            await post.save();
        }
        return this.toPost(post);
    }

    async removeShare(postId: string, userId: string): Promise<Post | null> {
        const post = await PostModel.findById(postId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Invalid user ID format');
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            throw new Error('Invalid post ID format');
        }

        if (!post) {
            throw new Error('Post not found');
        }
        if (post.shares && post.shares.includes(userObjectId)) {
            post.shares = post.shares.filter((share: mongoose.Types.ObjectId) => share.toString() !== userObjectId.toString());
            await post.save();
        }
        return this.toPost(post);
    }

    async addReaction(postId: string, userId: string, reactionType: "like" | "love" | "haha" | "wow" | "sad" | "angry"): Promise<Post | null> {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!post.reactions) {
            post.reactions = [];
        }
        const existingReaction = post.reactions.find((reaction: any) => reaction.user.toString() === userId);
        if (existingReaction) {
            existingReaction.type = reactionType;
        } else {
            post.reactions.push({
                user: new mongoose.Types.ObjectId(userId),
                type: reactionType,
                timestamp: new Date(),
            });
        }
        await post.save();
        return this.toPost(post);
    }

    async removeReaction(postId: string, userId: string): Promise<Post | null> {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        if (!post.reactions) {
            post.reactions = [];
        }
        const reactionIndex = post.reactions.findIndex((reaction: any) => reaction.user.toString() === userId);
        if (reactionIndex !== -1) {
            post.reactions.splice(reactionIndex, 1);
        }
        await post.save();
        return this.toPost(post);
    }

    async getRankedPost(userId: string): Promise<Post[]> {
        const posts = await PostModel.find({ userId });
        const rankedPosts = rankPosts(posts, userId);
        return rankedPosts.map(post => this.toPost(post));
    }

    private toPost(postDoc: any): Post {
        const postObj = postDoc.toObject();
        return {
            ...postObj,
            id: postObj._id.toString(), // map MongoDB _id to your domain id
        };
    }
}