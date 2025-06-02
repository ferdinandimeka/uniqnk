import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class AddReaction {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string, reactionType: keyof Post["reactions"]): Promise<Post | null> {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            return null;
        }

        if (post.reactions[reactionType] !== undefined) {
            post.reactions[reactionType]++;
        }
        return await this.postRepository.update(post);
    }
}