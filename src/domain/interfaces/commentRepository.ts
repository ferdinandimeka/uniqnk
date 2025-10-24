import { IComment } from "../../infrastructure/models/CommentModel";

export interface CommentRepository {
  create(data: {
    post: string;
    user: string;
    content: string;
  }): Promise<IComment>;
  
  replyToComment(
    commentId: string,
    userId: string,
    postId: string,
    content: string
  ): Promise<IComment | null>;

  findById(id: string): Promise<IComment | null>;

  findByPostId(postId: string): Promise<IComment[]>;

  deleteById(id: string): Promise<boolean>;

  likeComment(commentId: string, userId: string): Promise<IComment | null>;

  unlikeComment(commentId: string, userId: string): Promise<IComment | null>;
}
