import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class RemoveLike {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string, userId: string): Promise<Post | null> {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }

        post.likes = post.likes.filter((like) => like !== userId);
        return await this.postRepository.update(post);
    }
}