import { CommentRepository } from "../../domain/interfaces/commentRepository";

export class UnLikeCommentUseCase {
  constructor(private commentRepository: CommentRepository) {} 

  async execute(commentId: string, userId: string) {
    return this.commentRepository.unlikeComment(commentId, userId);
  }
}