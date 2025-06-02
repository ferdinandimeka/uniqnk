import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class DeletePost {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string): Promise<void> {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        await this.postRepository.delete(postId);
    }
}