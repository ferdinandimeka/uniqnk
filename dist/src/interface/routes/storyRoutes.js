"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyRoutes = void 0;
const express_1 = require("express");
const MongoStoryRepository_1 = require("../../infrastructure/repositories/MongoStoryRepository");
// import { InMemoryUserRepository } from "../../infrastructure/repositories/InMemoryUserRepository" 
const getAllStories_1 = require("../../use-cases/story/getAllStories");
const StoryController_1 = require("../controllers/StoryController");
const createStory_1 = require("../../use-cases/story/createStory");
const updateStory_1 = require("../../use-cases/story/updateStory");
const deleteStory_1 = require("../../use-cases/story/deleteStory");
const addReaction_1 = require("../../use-cases/story/addReaction");
const removeReaction_1 = require("../../use-cases/story/removeReaction");
const addViewer_1 = require("../../use-cases/story/addViewer");
const getActiveStories_1 = require("../../use-cases/story/getActiveStories");
const deleteExpiredStories_1 = require("../../use-cases/story/deleteExpiredStories");
const getStoryById_1 = require("../../use-cases/story/getStoryById");
const markStoryAsViewed_1 = require("../../use-cases/story/markStoryAsViewed");
// import { authenticateToken } from "../middleware/auth";
const router = (0, express_1.Router)();
exports.storyRoutes = router;
const storyRepository = new MongoStoryRepository_1.MongoStoryRepository();
const getAllStories = new getAllStories_1.GetAllStories(storyRepository);
const createstory = new createStory_1.CreateStory(storyRepository);
const getStoryById = new getStoryById_1.GetStoryById(storyRepository);
const updateStory = new updateStory_1.UpdateStory(storyRepository);
const deleteStory = new deleteStory_1.DeleteStory(storyRepository);
const deleteExpiredStories = new deleteExpiredStories_1.DeleteExpiredStories(storyRepository);
const addReaction = new addReaction_1.AddReaction(storyRepository);
const removeReaction = new removeReaction_1.RemoveReaction(storyRepository);
const addViewer = new addViewer_1.AddViewer(storyRepository);
const getActiveStories = new getActiveStories_1.GetActiveStories(storyRepository);
const markStoryAsViewed = new markStoryAsViewed_1.MarkStoryAsViewed(storyRepository);
const storyController = new StoryController_1.StoryController(createstory, getStoryById, getAllStories, updateStory, deleteStory, addReaction, removeReaction, deleteExpiredStories, addViewer, getActiveStories, markStoryAsViewed);
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
