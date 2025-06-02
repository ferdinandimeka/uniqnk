import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class AddShare {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string, userId: string): Promise<Post | null> {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }

        post.shares.push(userId);
        return await this.postRepository.update(post);
    }
}