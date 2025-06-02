import { Router } from "express"
import { MongoPostRepository } from "../../infrastructure/repositories/MongoPostRepository"
import { GetRankedPosts } from "../../use-cases/post/getRankPost"
import { PostController } from "../controllers/PostController"
import { AddLike } from "../../use-cases/post/addLike"
import { RemoveLike } from "../../use-cases/post/removeLike"
import { AddShare } from "../../use-cases/post/addShare"
import { RemoveShare } from "../../use-cases/post/removeShare"
import { AddReaction } from "../../use-cases/post/addReaction"
import { RemoveReaction } from "../../use-cases/post/removeReaction"
import { CreatePost } from "../../use-cases/post/createPost"
import { UpdatePost } from "../../use-cases/post/updatePost"
import { DeletePost } from "../../use-cases/post/deletePost"
import { AddComment } from "../../use-cases/post/addComment"
import { GetByUserId } from "../../use-cases/post/getByUserId"
import { RemoveComment } from "../../use-cases/post/removeComment"

const router = Router();
const postRepository = new MongoPostRepository();
const getRankedPosts = new GetRankedPosts(postRepository);
const addLike = new AddLike(postRepository);
const removeLike = new RemoveLike(postRepository);
const addShare = new AddShare(postRepository);
const removeShare = new RemoveShare(postRepository);
const addReaction = new AddReaction(postRepository);
const removeReaction = new RemoveReaction(postRepository);
const createPost = new CreatePost(postRepository);
const updatePost = new UpdatePost(postRepository);
const deletePost = new DeletePost(postRepository);
const addComment = new AddComment(postRepository);
const removeComment = new RemoveComment(postRepository);
const getByUserId = new GetByUserId(postRepository);
const postController = new PostController(
    addLike,
    removeLike,
    addShare,
    removeShare,
    addReaction,
    removeReaction,
    createPost,
    updatePost,
    deletePost,
    addComment,
    getByUserId,
    removeComment,
    getRankedPosts,
);

router.get("/", async (req, res, next) => {
    try {
        await postController.getRankedPosts(req, res, next);
    } catch (err) {
        next(err);
    }
});
router.post("/", (req, res, next) => {
    postController.createPost(req, res, next).catch(next);
});
router.put("/:id", (req, res, next) => {
    postController.updatePost(req, res, next).catch(next);
});
router.delete("/:id", (req, res, next) => {
    postController.deletePost(req, res, next).catch(next);
});
router.get("/user/:userId", (req, res, next) => {
    postController.getPostsByUserId(req, res, next).catch(next);
});
router.post("/:postId/like", async (req, res, next) => {
    try {
        await postController.addLikeToPost(req, res, next);
    } catch (err) {
        next(err);
    }
});
router.delete("/:postId/like", (req, res, next) => { 
    postController.removeLikeFromPost(req, res, next).catch(next);
});
router.post("/:postId/share", (req, res, next) => { 
    postController.addShareToPost(req, res, next).catch(next);
});
router.delete("/:postId/share", (req, res, next) => {
    postController.removeShareFromPost(req, res, next).catch(next);
});
router.post("/:postId/reaction", (req, res, next) => {
    postController.addReactionToPost(req, res, next).catch(next);
});
router.delete("/:postId/reaction", (req, res, next) => {
    postController.removeReactionFromPost(req, res, next).catch(next);
});
router.post("/:postId/comment", (req, res, next) => {
    postController.addCommentToPost(req, res, next).catch(next);
});
router.delete("/:postId/comment", (req, res, next) => {
    postController.removeCommentFromPost(req, res, next).catch(next);
});
