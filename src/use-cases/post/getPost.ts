import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class GetPostById {
    constructor(private postRepository: PostRepository) {}

    async execute(postId: string): Promise<Post | null> {
        return await this.postRepository.findById(postId);
    }
}