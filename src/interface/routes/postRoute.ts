import { Router } from "express"
import { MongoPostRepository } from "../../infrastructure/repositories/MongoPostRepository"
import { GetRankedPosts } from "../../use-cases/post/getRankPost"
import { PostController } from "../controllers/PostController"
import { AddLike } from "../../use-cases/post/addLike"
import { RemoveLike } from "../../use-cases/post/removeLike"
import { AddShare } from "../../use-cases/post/addShare"
import { RemoveShare } from "../../use-cases/post/removeShare"
import { AddReaction } from "../../use-cases/post/addReaction"
import { RemoveReaction } from "../../use-cases/post/removeReaction"
import { CreatePost } from "../../use-cases/post/createPost"
import { UpdatePost } from "../../use-cases/post/updatePost"
import { DeletePost } from "../../use-cases/post/deletePost"
import { AddComment } from "../../use-cases/post/addComment"
import { GetByUserId } from "../../use-cases/post/getByUserId"
import { RemoveComment } from "../../use-cases/post/removeComment"
import { GetAllPosts } from "../../use-cases/post/getAllPost"

const router = Router();
const postRepository = new MongoPostRepository();
const getRankedPosts = new GetRankedPosts(postRepository);
const addLike = new AddLike(postRepository);
const removeLike = new RemoveLike(postRepository);
const addShare = new AddShare(postRepository);
const removeShare = new RemoveShare(postRepository);
const addReaction = new AddReaction(postRepository);
const removeReaction = new RemoveReaction(postRepository);
const createPost = new CreatePost(postRepository);
const updatePost = new UpdatePost(postRepository);
const deletePost = new DeletePost(postRepository);
const addComment = new AddComment(postRepository);
const removeComment = new RemoveComment(postRepository);
const getByUserId = new GetByUserId(postRepository);
const getAllPost = new GetAllPosts(postRepository);
const postController = new PostController(
    addLike,
    removeLike,
    addShare,
    removeShare,
    addReaction,
    removeReaction,
    createPost,
    updatePost,
    deletePost,
    addComment,
    getByUserId,
    removeComment,
    getRankedPosts,
    getAllPost
);

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management endpoints
 */


/**
 * @swagger
 * /api/v1/posts/ranked:
 *   get:
 *     summary: Get ranked posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of ranked posts
 */
router.get("/ranked", async (req, res, next) => {
    try {
        await postController.getRankedPosts(req, res, next);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/v1/posts/all:
 *   get:
 *     summary: Get posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 */
router.get("/all", async (req, res, next) => {
    try {
        await postController.getAllPost(req, res, next);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/v1/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               content:
 *                 type: string
 *               mediaUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - userId
 *               - content
 *     responses:
 *       201:
 *         description: Post created
 */
router.post("/", (req, res, next) => {
    postController.createPost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               mediaUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Post updated
 *       404:
 *         description: Post not found
 */
router.put("/:id", (req, res, next) => {
    postController.updatePost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */
router.delete("/:id", (req, res, next) => {
    postController.deletePost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/user/{userId}:
 *   get:
 *     summary: Get posts by user ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's posts
 */
router.get("/user/:userId", (req, res, next) => {
    postController.getPostsByUserId(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post liked
 */
router.post("/:postId/like", async (req, res, next) => {
    try {
        await postController.addLikeToPost(req, res, next);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /api/v1/posts/{postId}/like:
*   delete:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unliked
 */
router.delete("/:postId/like", (req, res, next) => { 
    postController.removeLikeFromPost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{postId}/share:
 *   post:
 *     summary: share a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post shared
 */
router.post("/:postId/share", (req, res, next) => { 
    postController.addShareToPost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{postId}/share:
*   delete:
 *     summary: Unshare a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unshared
 */
router.delete("/:postId/share", (req, res, next) => {
    postController.removeShareFromPost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{postId}/reaction:
 *   post:
 *     summary: react to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post reaction
 */
router.post("/:postId/reaction", (req, res, next) => {
    postController.addReactionToPost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{postId}/reaction:
*   delete:
 *     summary: Unreact to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post unreaction
 */
router.delete("/:postId/reaction", (req, res, next) => {
    postController.removeReactionFromPost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{postId}/comment:
 *   post:
 *     summary: comment to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post comment
 */
router.post("/:postId/comment", (req, res, next) => {
    postController.addCommentToPost(req, res, next).catch(next);
});

/**
 * @swagger
 * /api/v1/posts/{postId}/comment:
*   delete:
 *     summary: Uncomment to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post uncomment
 */
router.delete("/:postId/comment", (req, res, next) => {
    postController.removeCommentFromPost(req, res, next).catch(next);
});


export { router as postRoutes };