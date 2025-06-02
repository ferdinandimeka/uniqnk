import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class RemoveComment {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string, commentId: string): Promise<Post | null> {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }

        post.comments = post.comments.filter((comment) => comment !== commentId)
        await this.postRepository.update(post);

        return post;
    }
}