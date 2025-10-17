import { IComment } from "../../infrastructure/models/CommentModel";

export interface CommentRepository {
  create(data: {
    post: string;
    user: string;
    content: string;
  }): Promise<IComment>;
  
  replyToComment(
    parentCommentId: string,
    userId: string,
    postId: string,
    content: string
  ): Promise<IComment>;

  findById(id: string): Promise<IComment | null>;

  findByPostId(postId: string): Promise<IComment[]>;

  deleteById(id: string): Promise<boolean>;
}
