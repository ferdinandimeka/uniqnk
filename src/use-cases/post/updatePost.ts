import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class UpdatePost {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string, updatedPost: Partial<Post>): Promise<Post | null> {
        const existingPost = await this.postRepository.findById(postId);
        if (!existingPost) {
            return null; // or throw an error
        }

        const mergedPost = Object.assign(Object.create(Object.getPrototypeOf(existingPost)), existingPost, updatedPost);
        return await this.postRepository.update(mergedPost);
    }
}