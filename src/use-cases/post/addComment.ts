import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class AddComment {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string, comment: string): Promise<Post | null> {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }
        post.comments.push(comment);
        return await this.postRepository.update(post);
    }
}