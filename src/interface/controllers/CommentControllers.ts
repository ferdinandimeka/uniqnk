import { ReplyToCommentUseCase } from "./../../use-cases/comment/replyToComment";
import { GetCommentByIdUseCase } from "../../use-cases/comment/getById";
import { LikeCommentUseCase } from "../../use-cases/comment/likeComment";
import { UnLikeCommentUseCase } from "../../use-cases/comment/unLikeComment";
import { NextFunction, Request, Response } from 'express'
import { getParam } from '../../utils/helper';

export class CommentController {
  constructor(
    // private addCommentUseCase,
    private replyToCommentUseCase: ReplyToCommentUseCase, 
    private getCommentByIdUseCase: GetCommentByIdUseCase,
    private AddLikeCommentUseCase: LikeCommentUseCase,
    private unLikeCommentUseCase: UnLikeCommentUseCase
  ) {}

  async replyToComment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const commentId = getParam(req.params.id); // parent comment
      const { userId, postId, content } = req.body;

      const reply = await this.replyToCommentUseCase.execute(
        commentId,
        userId,
        postId,
        content
      );

      return res.status(201).json({
        success: true,
        message: "Reply added successfully",
        data: reply,
      });
    } catch (error) {
      console.error("Error replying to comment:", error);
      const message = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ success: false, message });
    }
  }

  async getCommentById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const commentId = getParam(req.params.id);
      const comment = await this.getCommentByIdUseCase.execute(commentId);
      return res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error) {
      console.error("Error getting comment by ID:", error);
      const message = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ success: false, message });
    }
  }

  async likeComment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const commentId = getParam(req.params.id);
      const { userId } = req.body;
      const updatedComment = await this.AddLikeCommentUseCase.execute(commentId, userId);
      return res.status(200).json({
        success: true,
        message: "Comment liked successfully",
        data: updatedComment,
      });
    } catch (error) {
      console.error("Error liking comment:", error);
      const message = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ success: false, message });
    }
  }

  async unlikeComment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const commentId = getParam(req.params.id);
      const { userId } = req.body;
      const updatedComment = await this.unLikeCommentUseCase.execute(commentId, userId);
      return res.status(200).json({
        success: true,
        message: "Comment unliked successfully",
        data: updatedComment,
      });
    } catch (error) {
      console.error("Error unliking comment:", error);
      const message = error instanceof Error ? error.message : String(error);
      return res.status(500).json({ success: false, message });
    }
  }
}
