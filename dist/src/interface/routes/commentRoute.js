"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentRoutes = void 0;
const express_1 = require("express");
const MongoCommentRepository_1 = require("../../infrastructure/repositories/MongoCommentRepository");
const replyToComment_1 = require("../../use-cases/comment/replyToComment");
const getById_1 = require("../../use-cases/comment/getById");
const likeComment_1 = require("../../use-cases/comment/likeComment");
const unLikeComment_1 = require("../../use-cases/comment/unLikeComment");
const CommentControllers_1 = require("../controllers/CommentControllers");
const router = (0, express_1.Router)();
exports.commentRoutes = router;
const commentRepository = new MongoCommentRepository_1.MongoCommentRepository();
// const createComment = new CreateComment(commentRepository);
const replyToComment = new replyToComment_1.ReplyToCommentUseCase(commentRepository);
const getCommentById = new getById_1.GetCommentByIdUseCase(commentRepository);
const likeComment = new likeComment_1.LikeCommentUseCase(commentRepository);
const unLikeComment = new unLikeComment_1.UnLikeCommentUseCase(commentRepository);
const commentController = new CommentControllers_1.CommentController(replyToComment, getCommentById, likeComment, unLikeComment);
/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management endpoints
 */
/**
 * @swagger
 * /api/v1/comments/{commentId}/reply:
 *   post:
 *     summary: Reply to a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to reply to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - content
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user123"
 *               content:
 *                 type: string
 *                 example: "This is a reply to the comment."
 *     responses:
 *       201:
 *         description: Reply created successfully
 *       404:
 *         description: Comment not found
 *       400:
 *         description: Invalid input
 */
router.post("/:commentId/reply", async (req, res, next) => {
    try {
        await commentController.replyToComment(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/comments/{commentId}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *       404:
 *         description: Comment not found
 */
router.get("/:commentId", async (req, res, next) => {
    try {
        await commentController.getCommentById(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/comments/{commentId}/like:
 *   post:
 *     summary: Like a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to like
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         required: true
 *         description: The ID of the user liking the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment liked successfully
 *       404:
 *         description: Comment not found
 *       400:
 *         description: Invalid input
 */
router.post("/:commentId/like", async (req, res, next) => {
    try {
        await commentController.likeComment(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/comments/{commentId}/unlike:
 *   post:
 *     summary: Unlike a comment
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: The ID of the comment to unlike
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         required: true
 *         description: The ID of the user unliking the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment unliked successfully
 *       404:
 *         description: Comment not found
 *       400:
 *         description: Invalid input
 */
router.post("/:commentId/unlike", async (req, res, next) => {
    try {
        await commentController.unlikeComment(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
