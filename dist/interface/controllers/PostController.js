"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const apiResponse_1 = require("../../utils/apiResponse");
class PostController {
    constructor(addLike, removeLike, addShare, removeShare, addReaction, removeReaction, createPosts, updatePosts, deletePosts, addComment, getByUserId, removeComment, getRankedPostsUseCase, getAllPosts, getPostById) {
        this.addLike = addLike;
        this.removeLike = removeLike;
        this.addShare = addShare;
        this.removeShare = removeShare;
        this.addReaction = addReaction;
        this.removeReaction = removeReaction;
        this.createPosts = createPosts;
        this.updatePosts = updatePosts;
        this.deletePosts = deletePosts;
        this.addComment = addComment;
        this.getByUserId = getByUserId;
        this.removeComment = removeComment;
        this.getRankedPostsUseCase = getRankedPostsUseCase;
        this.getAllPosts = getAllPosts;
        this.getPostById = getPostById;
    }
    async addLikeToPost(req, res, next) {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const updatedPost = await this.addLike.execute(postId, userId);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Like added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async getPostsById(req, res, next) {
        try {
            const { id } = req.params;
            const post = await this.getPostById.execute(id);
            if (!post) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, post, "Post retrieved successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async removeLikeFromPost(req, res, next) {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const updatedPost = await this.removeLike.execute(postId, userId);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Like removed successfully"));
        }
        catch (error) {
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
    async addCommentToPost(req, res, next) {
        try {
            const { postId } = req.params;
            const { comment, userId } = req.body;
            // const userId = req.user?.id; // or however you attach user info
            if (!userId) {
                return res.status(401).json(new apiResponse_1.ApiResponse(401, null, "Unauthorized"));
            }
            if (!comment || typeof comment !== "string") {
                return res.status(400).json(new apiResponse_1.ApiResponse(400, null, "Invalid comment"));
            }
            const updatedPost = await this.addComment.execute(postId, userId, comment);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Comment added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async addShareToPost(req, res, next) {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const updatedPost = await this.addShare.execute(postId, userId);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Share added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async removeShareFromPost(req, res, next) {
        try {
            const { postId } = req.params;
            const { userId } = req.body;
            const updatedPost = await this.removeShare.execute(postId, userId);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Share removed successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async addReactionToPost(req, res, next) {
        try {
            const { postId } = req.params;
            const { reactionType } = req.body;
            const updatedPost = await this.addReaction.execute(postId, reactionType);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Reaction added successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async removeReactionFromPost(req, res, next) {
        try {
            const { postId } = req.params;
            const { userId, reactionType } = req.body;
            const updatedPost = await this.removeReaction.execute(postId, userId, reactionType);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Reaction removed successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async createPost(req, res, next) {
        try {
            const post = req.body;
            const createdPost = await this.createPosts.execute(post);
            return res.status(201).json(new apiResponse_1.ApiResponse(201, createdPost, "Post created successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async updatePost(req, res, next) {
        try {
            const { id } = req.params;
            const post = req.body;
            const updatedPost = await this.updatePosts.execute(id, post);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Post updated successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async deletePost(req, res, next) {
        try {
            const { id } = req.params;
            await this.deletePosts.execute(id);
            return res.status(204).json(new apiResponse_1.ApiResponse(204, null, "Post deleted successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async getPostsByUserId(req, res, next) {
        try {
            const { userId } = req.params;
            const posts = await this.getByUserId.execute(userId);
            return res.status(200).json(new apiResponse_1.ApiResponse(200, posts, "Posts fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async removeCommentFromPost(req, res, next) {
        try {
            const { postId } = req.params;
            const { commentId } = req.body;
            const updatedPost = await this.removeComment.execute(postId, commentId);
            if (!updatedPost) {
                return res.status(404).json(new apiResponse_1.ApiResponse(404, null, "Post not found"));
            }
            return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedPost, "Comment removed successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async getRankedPosts(req, res, next) {
        try {
            const { userId } = req.query;
            if (!userId || typeof userId !== "string") {
                return res.status(400).json({ message: "userId query parameter is required" });
            }
            const rankedPosts = await this.getRankedPostsUseCase.execute(userId);
            return res.status(200).json(new apiResponse_1.ApiResponse(200, rankedPosts, "Ranked posts fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
    async getAllPost(req, res, next) {
        try {
            const posts = await this.getAllPosts.execute();
            return res.status(200).json(new apiResponse_1.ApiResponse(200, posts, "All posts fetched successfully"));
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PostController = PostController;
