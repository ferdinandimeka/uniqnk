import { CommentRepository } from "../../domain/interfaces/commentRepository";

export class LikeCommentUseCase {
  constructor(private commentRepository: CommentRepository) {} 

  async execute(commentId: string, userId: string) {
    return this.commentRepository.likeComment(commentId, userId);
  }
}