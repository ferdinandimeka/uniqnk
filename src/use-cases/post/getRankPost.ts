import { PostRepository } from "../../domain/interfaces/postRepository";
import { Post } from "../../domain/entities/Post";

export class GetRankedPosts {
  constructor(private postRepository: PostRepository) {}

  async execute(userId: string): Promise<Post[]> {
    const posts = await this.postRepository.findByUserId(userId);
    
    const rankedPosts: Post[] = [];

    for (const post of posts) {
        const rank = (post.likes?.length || 0) + (post.comments?.length || 0);
        post.rank = rank;
        const updatedPost = await this.postRepository.update(post);
        if (updatedPost) rankedPosts.push(updatedPost);
    }

    // Optionally sort by rank descending
    rankedPosts.sort((a, b) => (b.rank || 0) - (a.rank || 0));

    return rankedPosts;
  }
}
