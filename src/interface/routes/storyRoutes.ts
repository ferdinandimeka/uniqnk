import { Router } from "express"
import { MongoStoryRepository } from "../../infrastructure/repositories/MongoStoryRepository" 
// import { InMemoryUserRepository } from "../../infrastructure/repositories/InMemoryUserRepository" 
import { GetAllStories } from "../../use-cases/story/getAllStories"
import { StoryController } from "../controllers/StoryController"
import { CreateStory } from "../../use-cases/story/createStory"
import { UpdateStory } from "../../use-cases/story/updateStory"
import { DeleteStory } from "../../use-cases/story/deleteStory"
import { AddReaction } from "../../use-cases/story/addReaction";
import { RemoveReaction } from "../../use-cases/story/removeReaction";
import { AddViewer } from "../../use-cases/story/addViewer";
import { GetActiveStories } from "../../use-cases/story/getActiveStories";
import { DeleteExpiredStories } from "../../use-cases/story/deleteExpiredStories"
import { GetStoryById } from "../../use-cases/story/getStoryById"
import { MarkStoryAsViewed } from "../../use-cases/story/markStoryAsViewed";
// import { authenticateToken } from "../middleware/auth";

const router = Router();

const storyRepository = new MongoStoryRepository();
const getAllStories = new GetAllStories(storyRepository);
const createstory = new CreateStory(storyRepository);
const getStoryById = new GetStoryById(storyRepository);
const updateStory = new UpdateStory(storyRepository);
const deleteStory = new DeleteStory(storyRepository);
const deleteExpiredStories = new DeleteExpiredStories(storyRepository);
const addReaction = new AddReaction(storyRepository);
const removeReaction = new RemoveReaction(storyRepository);
const addViewer = new AddViewer(storyRepository);
const getActiveStories = new GetActiveStories(storyRepository);
const markStoryAsViewed = new MarkStoryAsViewed(storyRepository);
const storyController = new StoryController(createstory, getStoryById, getAllStories, updateStory, deleteStory, addReaction, removeReaction, deleteExpiredStories, addViewer, getActiveStories, markStoryAsViewed);

router.get("/", (req, res, next) => storyController.getAllStories(req, res, next));
router.post("/", (req, res, next) => storyController.create(req, res, next));
router.get("/:id", (req, res, next) => storyController.getStoryById(req, res, next));
router.put("/:id", (req, res, next) => storyController.update(req, res, next));
router.delete("/:id", (req, res, next) => storyController.delete(req, res, next));
router.put("/:id/reactions", (req, res, next) => storyController.addReaction(req, res, next));
router.delete("/:id/reactions", (req, res, next) => storyController.removeReaction(req, res, next));
router.delete("/expired", (req, res, next) => storyController.deleteExpiredStories(req, res, next));
router.put("/:id/viewer", (req, res, next) => storyController.addViewer(req, res, next));
router.get("/active-stories", (req, res, next) => storyController.getActiveStories(req, res, next));
router.put("/:id/mark-viewed", (req, res, next) => storyController.markStoryAsViewed(req, res, next));

export { router as storyRoutes };