/**
 * Calculates the ranking score for a given post based on engagement and recency.
 *
 * The score is determined using a weighted formula that considers:
 * - Likes (lower weight as they are quick, low-effort interactions)
 * - Comments (higher weight for deeper engagement)
 * - Shares (highest weight as they indicate strong interest)
 * - Recent Interactions (boost for posts from frequently engaged users)
 * - Time Decay (penalizes older posts to keep the feed fresh)
 *
 * @param {Object} post - The post object containing engagement details.
 * @param {string} currentUser - The ID of the current user viewing the feed.
 * @returns {number} The calculated score for the post.
 */

const calculatePostScore = (post: { likes: string | any[]; comments: string | any[]; shares: string | any[]; createdAt: string | number | Date; userId: any; }, currentUser: any): number => {
    const likeWeight = 1.5;
    const commentWeight = 2;
    const shareWeight = 3;
    const recentInteractionWeight = 0.8;
    const timeDecayFactor = 0.5;

    const likes = post.likes.length;
    const comments = post.comments.length;
    const shares = post.shares.length;
    const postAge = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60); // in hours

    // Check if the current user has interacted with this post or user before
    const recentInteraction = post.userId === currentUser || post.likes.includes(currentUser);

    // Calculate score
    const score = (likes * likeWeight) + (comments * commentWeight) + (shares * shareWeight) +
                  (recentInteraction ? recentInteractionWeight : 0) - (postAge * timeDecayFactor);

    return score;
};

export const rankPosts = (posts: any[], currentUser: any) => {
    return posts
        .map((post: any) => ({ ...post, score: calculatePostScore(post, currentUser) }))
        .sort((a: { score: number; }, b: { score: number; }) => b.score - a.score);
};
