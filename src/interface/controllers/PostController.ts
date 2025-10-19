// import { GetAllPosts } from './../../use-cases/post/getAllPost';
import { AddComment } from './../../use-cases/post/addComment';
import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../utils/apiResponse";
import { GetRankedPosts } from "../../use-cases/post/getRankPost";
import { AddLike } from "../../use-cases/post/addLike";
import { RemoveLike } from "../../use-cases/post/removeLike";
import { AddShare } from "../../use-cases/post/addShare";
import { RemoveShare } from "../../use-cases/post/removeShare";
import { AddReaction } from "../../use-cases/post/addReaction";
import { RemoveReaction } from "../../use-cases/post/removeReaction";
import { CreatePost } from "../../use-cases/post/createPost";
import { UpdatePost } from "../../use-cases/post/updatePost";
import { DeletePost } from "../../use-cases/post/deletePost";
import { GetByUserId } from "../../use-cases/post/getByUserId";
import { RemoveComment } from "../../use-cases/post/removeComment";
import { GetAllPosts } from "../../use-cases/post/getAllPost";
import { GetPostById } from '../../use-cases/post/getPost';

export class PostController {
    constructor(
        private addLike: AddLike,
        private removeLike: RemoveLike,
        private addShare: AddShare,
        private removeShare: RemoveShare,
        private addReaction: AddReaction,
        private removeReaction: RemoveReaction,
        private createPosts: CreatePost,
        private updatePosts: UpdatePost,
        private deletePosts: DeletePost,
        private addComment: AddComment,
        private getByUserId: GetByUserId,
        private removeComment: RemoveComment,
        private getRankedPostsUseCase: GetRankedPosts,
        private getAllPosts: GetAllPosts,
        private getPostById: GetPostById,
        // Add other use-cases here as needed, e.g., createPost, updatePost, etc.
    ) {}

    async addLikeToPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const updatedPost = await this.addLike.execute(postId, userId);
            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, updatedPost, "Like added successfully"));
        } catch (error) {
            next(error);
        }
    }

    async getPostsById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const post = await this.getPostById.execute(id);
            if (!post) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, post, "Post retrieved successfully"));
        } catch (error) {
            next(error);
        }
    }

    async removeLikeFromPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const updatedPost = await this.removeLike.execute(postId, userId);
            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, updatedPost, "Like removed successfully"));
        } catch (error) {
            next(error);
        }
    }

    // async addCommentToPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    //     try {
    //         const { postId } = req.params;
    //         const { comment } = req.body;
    //         const updatedPost = await this.addComment.execute(postId, comment);
    //         if (!updatedPost) {
    //             return res.status(404).json(new ApiResponse(404, null, "Post not found"));
    //         }
    //         return res.status(200).json(new ApiResponse(200, updatedPost, "Comment added successfully"));
    //     } catch (error) {
    //         next(error);
    //     }
    // }
    async addCommentToPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { postId } = req.params;
            const { comment, userId } = req.body;
            // const userId = req.user?.id; // or however you attach user info

            if (!userId) {
                return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
            }

            if (!comment || typeof comment !== "string") {
                return res.status(400).json(new ApiResponse(400, null, "Invalid comment"));
            }

            const updatedPost = await this.addComment.execute(postId, userId, comment);

            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }

            return res.status(200).json(new ApiResponse(200, updatedPost, "Comment added successfully"));
        } catch (error) {
            next(error);
        }
    }


    async addShareToPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const updatedPost = await this.addShare.execute(postId, userId);
            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, updatedPost, "Share added successfully"));
        } catch (error) {
            next(error);
        }
    }

    async removeShareFromPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const updatedPost = await this.removeShare.execute(postId, userId);
            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, updatedPost, "Share removed successfully"));
        } catch (error) {
            next(error);
        }
    }

    async addReactionToPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { postId } = req.params;
            const { reactionType } = req.body;
            const updatedPost = await this.addReaction.execute(postId, reactionType);
            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, updatedPost, "Reaction added successfully"));
        } catch (error) {
            next(error);
        }
    }

    async removeReactionFromPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { postId } = req.params;
            const { userId, reactionType } = req.body;
            const updatedPost = await this.removeReaction.execute(postId, userId, reactionType);
            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, updatedPost, "Reaction removed successfully"));
        } catch (error) {
            next(error);
        }
    }

    async createPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const post = req.body;
            const createdPost = await this.createPosts.execute(post);
            return res.status(201).json(new ApiResponse(201, createdPost, "Post created successfully"));
        } catch (error) {
            next(error);
        }
    }

    async updatePost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const post = req.body;
            const updatedPost = await this.updatePosts.execute(id, post);
            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
        } catch (error) {
            next(error);
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            await this.deletePosts.execute(id);
            return res.status(204).json(new ApiResponse(204, null, "Post deleted successfully"));
        } catch (error) {
            next(error);
        }
    }

    async getPostsByUserId(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { userId } = req.params;
            const posts = await this.getByUserId.execute(userId);
            return res.status(200).json(new ApiResponse(200, posts, "Posts fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    async removeCommentFromPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { postId } = req.params;
            const { commentId } = req.body;
            const updatedPost = await this.removeComment.execute(postId, commentId);
            if (!updatedPost) {
                return res.status(404).json(new ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new ApiResponse(200, updatedPost, "Comment removed successfully"));
        } catch (error) {
            next(error);
        }
    }

    async getRankedPosts(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { userId } = req.query;
            if (!userId || typeof userId !== "string") {
                return res.status(400).json({ message: "userId query parameter is required" });
            }
            const rankedPosts = await this.getRankedPostsUseCase.execute(userId);
            return res.status(200).json(new ApiResponse(200, rankedPosts, "Ranked posts fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    async getAllPost(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const posts = await this.getAllPosts.execute();
            return res.status(200).json(new ApiResponse(200, posts, "All posts fetched successfully"));
        } catch (error) {
            next(error);
        }
    }

    // Add other post methods (create, update, delete, etc.) here
}
