import { CommentRepository } from "../../domain/interfaces/commentRepository";

export class ReplyToCommentUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(
    parentCommentId: string,
    userId: string,
    postId: string,
    content: string
  ) {
    if (!content) throw new Error("Reply content is required");

    return await this.commentRepository.replyToComment(
      parentCommentId,
      userId,
      postId,
      content
    );
  }
}
