import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class CreatePost {
    constructor(private postRepository: PostRepository) {}

    async execute(post: Post) {
        return await this.postRepository.create(post);
    }
}