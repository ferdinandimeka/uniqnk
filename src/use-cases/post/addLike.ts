import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class AddLike {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string, userId: string): Promise<Post | null> {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }

        post.likes.push(userId);
        return await this.postRepository.update(post);
    }
}