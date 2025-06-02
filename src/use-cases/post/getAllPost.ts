import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class GetAllPosts {
    constructor(private postRepository: PostRepository) {}

    async execute(): Promise<Post[]> {
        return await this.postRepository.findAll();
    }
}