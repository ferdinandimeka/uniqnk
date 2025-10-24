import { Router, Request, Response, NextFunction } from "express";
import { MongoCommentRepository } from "../../infrastructure/repositories/MongoCommentRepository";
import { ReplyToCommentUseCase } from "../../use-cases/comment/replyToComment";
import { GetCommentByIdUseCase } from "../../use-cases/comment/getById";
import { LikeCommentUseCase } from "../../use-cases/comment/likeComment";
import { UnLikeCommentUseCase } from "../../use-cases/comment/unLikeComment";
import { CommentController } from "../controllers/CommentControllers";

const router = Router();

const commentRepository = new MongoCommentRepository();
// const createComment = new CreateComment(commentRepository);
const replyToComment = new ReplyToCommentUseCase(commentRepository);
const getCommentById = new GetCommentByIdUseCase(commentRepository);
const likeComment = new LikeCommentUseCase(commentRepository);
const unLikeComment = new UnLikeCommentUseCase(commentRepository);

const commentController = new CommentController( replyToComment, getCommentById, likeComment, unLikeComment);

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
router.post(
  "/:commentId/reply",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentController.replyToComment(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

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
router.get(
  "/:commentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentController.getCommentById(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

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
router.post(
  "/:commentId/like",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentController.likeComment(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

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
router.post(
  "/:commentId/unlike",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentController.unlikeComment(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);


export { router as commentRoutes };