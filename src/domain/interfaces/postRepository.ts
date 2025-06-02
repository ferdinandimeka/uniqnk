import { Post } from "../entities/Post";

export interface PostRepository {
    create(post: Post): Promise<Post>;
    findById(id: string): Promise<Post | null>;
    findByUserId(userId: string): Promise<Post[]>;
    findAll(): Promise<Post[]>;
    update(post: Post): Promise<Post | null>;
    delete(id: string): Promise<void>;
    addLike(postId: string, userId: string): Promise<Post | null>;
    removeLike(postId: string, userId: string): Promise<Post | null>;
    addComment(postId: string, commentId: string): Promise<Post | null>;
    removeComment(postId: string, commentId: string): Promise<Post | null>;
    addShare(postId: string, userId: string): Promise<Post | null>;
    removeShare(postId: string, userId: string): Promise<Post | null>;
    addReaction(postId: string, userId: string, reactionType: "like" | "love" | "haha" | "wow" | "sad" | "angry"): Promise<Post | null>;
    removeReaction(postId: string, userId: string): Promise<Post | null>;
    getRankedPost(userId: string): Promise<Post[]>;
}