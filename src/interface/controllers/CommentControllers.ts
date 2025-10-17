import { ReplyToCommentUseCase } from "./../../use-cases/comment/replyToComment";
import { NextFunction, Request, Response } from 'express'

export class CommentController {
  constructor(
    // private addCommentUseCase,
    private replyToCommentUseCase: ReplyToCommentUseCase
  ) {}

  async replyToComment(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { commentId } = req.params; // parent comment
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
}
