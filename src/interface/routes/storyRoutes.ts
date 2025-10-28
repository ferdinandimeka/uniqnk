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


/**
 * @swagger
 * tags:
 *   name: Stories
 *   description: Story management endpoints
 */

/**
 * @swagger
 * /api/v1/stories:
 *   get:
 *     summary: Get all stories
 *     tags: [Stories]
 *     responses:
 *       200:
 *         description: List of stories
 */
router.get("/", (req, res, next) => storyController.getAllStories(req, res, next));

/**
 * @swagger
 * /api/v1/stories:
 *   post:
 *     summary: Create a new story
 *     tags: [Stories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               contentType:
 *                 type: string
 *               contentUrl:
 *                 type: string
 *               text:
 *                 type: string
 *               backgroundColor:
 *                 type: string
 *     responses:
 *       201:
 *         description: Story created
 */
router.post("/", (req, res, next) => storyController.create(req, res, next));

/**
 * @swagger
 * /api/v1/stories/{id}:
 *   get:
 *     summary: Get a story by ID
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Story ID
 *     responses:
 *       200:
 *         description: Story found
 *       404:
 *         description: Story not found
 */
router.get("/:id", (req, res, next) => storyController.getStoryById(req, res, next));

/**
 * @swagger
 * /api/v1/stories/{id}:
 *   put:
 *     summary: Update a story by ID
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Story ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               backgroundColor:
 *                 type: string
 *     responses:
 *       200:
 *         description: Story updated
 *       404:
 *         description: Story not found
 */
router.put("/:id", (req, res, next) => storyController.update(req, res, next));

/**
 * @swagger
 * /api/v1/stories/{id}:
 *   delete:
 *     summary: Delete a story by ID
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Story ID
 *     responses:
 *       200:
 *         description: Story deleted
 *       404:
 *         description: Story not found
 */
router.delete("/:id", (req, res, next) => storyController.delete(req, res, next));

/**
 * @swagger
 * /api/v1/stories/{id}/reactions:
 *   put:
 *     summary: Add a reaction to a story
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Story ID
 *     responses:
 *       200:
 *         description: Reaction added
 */

router.put("/:id/reactions", (req, res, next) => storyController.addReaction(req, res, next));

/**
 * @swagger
 * /api/v1/stories/{id}/reactions:
 *   delete:
 *     summary: Remove a reaction from a story
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Story ID
 *     responses:
 *       200:
 *         description: Reaction removed
 */
router.delete("/:id/reactions", (req, res, next) => storyController.removeReaction(req, res, next));

/**
 * @swagger
 * /api/v1/stories/expired:
 *   delete:
 *     summary: Delete expired stories
 *     tags: [Stories]
 *     responses:
 *       200:
 *         description: Expired stories deleted
 */
router.delete("/expired", (req, res, next) => storyController.deleteExpiredStories(req, res, next));

/**
 * @swagger
 * /api/v1/stories/{id}/viewer:
 *   put:
 *     summary: Add a viewer to a story
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Story ID
 *     responses:
 *       200:
 *         description: Viewer added
 */
router.put("/:id/viewer", (req, res, next) => storyController.addViewer(req, res, next));

/**
 * @swagger
 * /api/v1/stories/active-stories:
 *   get:
 *     summary: Get active stories
 *     tags: [Stories]
 *     responses:
 *       200:
 *         description: List of active stories
 */
router.get("/active-stories", (req, res, next) => storyController.getActiveStories(req, res, next));

/**
 * @swagger
 * /api/v1/stories/{id}/mark-viewed:
 *   put:
 *     summary: Mark a story as viewed
 *     tags: [Stories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Story ID
 *     responses:
 *       200:
 *         description: Story marked as viewed
 */
router.put("/:id/mark-viewed", (req, res, next) => storyController.markStoryAsViewed(req, res, next));

export { router as storyRoutes };