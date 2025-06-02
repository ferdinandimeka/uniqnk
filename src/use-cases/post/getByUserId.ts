import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class GetByUserId {
    constructor(private postRepository: PostRepository) {}

    async execute(userId: string): Promise<Post[]> {
        return await this.postRepository.findByUserId(userId);
    }
}