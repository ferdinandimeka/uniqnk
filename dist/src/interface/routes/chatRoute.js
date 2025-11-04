"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const express_1 = require("express");
const MongoChatRepository_1 = require("../../infrastructure/repositories/MongoChatRepository");
const ChatController_1 = require("../controllers/ChatController");
const createChat_1 = require("../../use-cases/chat/createChat");
const deleteChat_1 = require("../../use-cases/chat/deleteChat");
const deleteChatMessage_1 = require("../../use-cases/chat/deleteChatMessage");
const getMessages_1 = require("../../use-cases/chat/getMessages");
const getUserChats_1 = require("../../use-cases/chat/getUserChats");
const markMessageAsRead_1 = require("../../use-cases/chat/markMessageAsRead");
const sendMessage_1 = require("../../use-cases/chat/sendMessage");
const getAllChat_1 = require("../../use-cases/chat/getAllChat");
const router = (0, express_1.Router)();
exports.chatRoutes = router;
const chatRepository = new MongoChatRepository_1.MongoChatRepository();
const createChat = new createChat_1.CreateChat(chatRepository);
const deleteChat = new deleteChat_1.DeleteChat(chatRepository);
const deleteChatMessage = new deleteChatMessage_1.DeleteChatMessage(chatRepository);
const getMessage = new getMessages_1.GetMessages(chatRepository);
const getuserChats = new getUserChats_1.GetUserChats(chatRepository);
const markMessageAsRead = new markMessageAsRead_1.MarkMessageAsRead(chatRepository);
const sendMessage = new sendMessage_1.SendMessage(chatRepository);
const getAllChats = new getAllChat_1.GetAllChats(chatRepository);
const chatController = new ChatController_1.ChatController(createChat, deleteChat, deleteChatMessage, getMessage, getuserChats, markMessageAsRead, sendMessage, getAllChats);
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management APIs
 */
/**
 * @swagger
 * /api/v1/chat:
 *   get:
 *     summary: Get all chats
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: List of Chats
 */
router.get("/", (req, res, next) => chatController.getAllChat(req, res, next));
/**
 * @swagger
 * /api/v1/chat/create:
 *   post:
 *     summary: Create a new chat between users
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participants
 *             properties:
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["672ebd5c29b4de982ae7b53d", "672ebd5c29b4de982ae7b53f"]
 *     responses:
 *       200:
 *         description: Chat created successfully
 *       400:
 *         description: Invalid request body
 */
router.post("/create", async (req, res, next) => {
    try {
        await chatController.createChat(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/chat/send:
 *   post:
 *     summary: Send a message (text or media) in a chat
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - sender
 *             properties:
 *               chatId:
 *                 type: string
 *                 example: "672ebd5c29b4de982ae7b53d"
 *               sender:
 *                 type: string
 *                 example: "672ebd5c29b4de982ae7b53f"
 *               receiver:
 *                 type: string
 *                 example: "672ebd5c29b4de982ae7b53f"
 *               text:
 *                 type: string
 *                 example: "Hey, how are you?"
 *               mediaUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image.jpg"]
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid input
 */
router.post("/send", async (req, res, next) => {
    try {
        await chatController.sendMessage(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/chat/user/{userId}:
 *   get:
 *     summary: Get all chats for a specific user
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Successfully retrieved user chats
 *       404:
 *         description: No chats found
 */
router.get("/user/:userId", async (req, res, next) => {
    try {
        await chatController.getUserChats(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/chat/{chatId}/messages:
 *   get:
 *     summary: Get all messages in a chat
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chat
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *       404:
 *         description: No messages found
 */
router.get("/:chatId/messages", async (req, res, next) => {
    try {
        await chatController.getMessages(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/chat/read/{messageId}:
 *   patch:
 *     summary: Mark a message as read
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message
 *     responses:
 *       200:
 *         description: Message marked as read
 */
router.put("/read/:messageId", async (req, res, next) => {
    try {
        await chatController.markMessageAsRead(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/chat/{chatId}:
 *   delete:
 *     summary: Delete a chat
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chat to delete
 *     responses:
 *       200:
 *         description: Chat deleted successfully
 */
router.delete("/:chatId", async (req, res, next) => {
    try {
        await chatController.deleteChat(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
/**
 * @swagger
 * /api/v1/chat/message/{messageId}:
 *   delete:
 *     summary: Delete a specific message
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 */
router.delete("/message/:messageId", async (req, res, next) => {
    try {
        await chatController.deleteMessage(req, res, next);
    }
    catch (err) {
        next(err);
    }
});
