import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class RemoveLike {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string, userId: string): Promise<Post | null> {
       return this.postRepository.removeLike(postId, userId);
    }
}