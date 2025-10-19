import { CommentRepository } from "../../domain/interfaces/commentRepository";

export class GetCommentByIdUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute(commentId: string) {
    return this.commentRepository.findById(commentId);
  }
}