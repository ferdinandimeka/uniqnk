"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = require("express");
const MongoPostRepository_1 = require("../../infrastructure/repositories/MongoPostRepository");
const MongoCommentRepository_1 = require("../../infrastructure/repositories/MongoCommentRepository");
const getRankPost_1 = require("../../use-cases/post/getRankPost");
const PostController_1 = require("../controllers/PostController");
const addLike_1 = require("../../use-cases/post/addLike");
const removeLike_1 = require("../../use-cases/post/removeLike");
const addShare_1 = require("../../use-cases/post/addShare");
const removeShare_1 = require("../../use-cases/post/removeShare");
const addReaction_1 = require("../../use-cases/post/addReaction");
const removeReaction_1 = require("../../use-cases/post/removeReaction");
const createPost_1 = require("../../use-cases/post/createPost");
const updatePost_1 = require("../../use-cases/post/updatePost");
const deletePost_1 = require("../../use-cases/post/deletePost");
const addComment_1 = require("../../use-cases/post/addComment");
const getByUserId_1 = require("../../use-cases/post/getByUserId");
const removeComment_1 = require("../../use-cases/post/removeComment");
const getAllPost_1 = require("../../use-cases/post/getAllPost");
const getPost_1 = require("../../use-cases/post/getPost");
const router = (0, express_1.Router)();
exports.postRoutes = router;
const postRepository = new MongoPostRepository_1.MongoPostRepository();
const commentRepository = new MongoCommentRepository_1.MongoCommentRepository();
const getRankedPosts = new getRankPost_1.GetRankedPosts(postRepository);
const addLike = new addLike_1.AddLike(postRepository);
const removeLike = new removeLike_1.RemoveLike(postRepository);
const addShare = new addShare_1.AddShare(postRepository);
const removeShare = new removeShare_1.RemoveShare(postRepository);
const addReaction = new addReaction_1.AddReaction(postRepository);
const removeReaction = new removeReaction_1.RemoveReaction(postRepository);
const createPost = new createPost_1.CreatePost(postRepository);
const updatePost = new updatePost_1.UpdatePost(postRepository);
const deletePost = new deletePost_1.DeletePost(postRepository);
const addComment = new addComment_1.AddComment(postRepository, commentRepository);
const removeComment = new removeComment_1.RemoveComment(postRepository);
const getByUserId = new getByUserId_1.GetByUserId(postRepository);
const getAllPost = new getAllPost_1.GetAllPosts(postRepository);
const getPostById = new getPost_1.GetPostById(postRepository);
const postController = new PostController_1.PostController(addLike, removeLike, addShare, removeShare, addReaction, removeReaction, createPost, updatePost, deletePost, addComment, getByUserId, removeComment, getRankedPosts, getAllPost, getPostById);
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
 *     summary: Get ranked posts for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID to get ranked posts for
 *     responses:
 *       200:
 *         description: List of ranked posts for the given user
 */
router.get("/ranked", async (req, res, next) => {
    try {
        await postController.getRankedPosts(req, res, next);
    }
    catch (err) {
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
    }
    catch (err) {
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
 * /api/v1/posts/{id}:
 *   get:
 *     summary: Get a post by ID
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
 *         description: Post found
 *       404:
 *         description: Post not found
 */
router.get("/:id", (req, res, next) => {
    postController.getPostsById(req, res, next).catch(next);
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d5ec49f1c2b14b2c8b4567"
 *     responses:
 *       200:
 *         description: Post liked
 */
router.post("/:postId/like", async (req, res, next) => {
    try {
        await postController.addLikeToPost(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/posts/{postId}/unlike:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d5ec49f1c2b14b2c8b4567"
 *     responses:
 *       200:
 *         description: Post unliked
 */
router.delete("/:postId/unlike", (req, res, next) => {
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
 *     summary: Add a comment to a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *               - userId
 *             properties:
 *               content:
 *                 type: string
 *                 example: "This is my comment!"
 *               userId:
 *                 type: string
 *                 example: "60d5ec49f1c2b14b2c8b4567"
 *     responses:
 *       200:
 *         description: Comment successfully added
 *       400:
 *         description: Invalid request data
 *       404:
 *         description: Post not found
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
 *     requestBody:
 *       required: true
 *       comment:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *             properties:
 *               commentId:
 *                 type: string
 *                 example: "60d5ec49f1c2b14b2c8b4567"
 *     responses:
 *       200:
 *         description: Post uncomment
 */
router.delete("/:postId/comment", (req, res, next) => {
    postController.removeCommentFromPost(req, res, next).catch(next);
});
