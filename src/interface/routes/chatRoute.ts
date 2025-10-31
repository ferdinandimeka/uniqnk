import { Router } from "express";
import { MongoChatRepository } from "../../infrastructure/repositories/MongoChatRepository";
import { ChatController } from "../controllers/ChatController";
import { CreateChat } from "../../use-cases/chat/createChat";
import { DeleteChat } from "../../use-cases/chat/deleteChat";
import { GetMessages } from "../../use-cases/chat/getMessages";
import { GetUserChats } from "../../use-cases/chat/getUserChats";
import { MarkMessageAsRead } from "../../use-cases/chat/markMessageAsRead";
import { SendMessage } from "../../use-cases/chat/sendMessage";

const router = Router();

const chatRepository = new MongoChatRepository();
const createChat = new CreateChat(chatRepository);
const deleteChat = new DeleteChat(chatRepository);
const getMessage = new GetMessages(chatRepository);
const getuserChats = new GetUserChats(chatRepository);
const markMessageAsRead = new MarkMessageAsRead(chatRepository);
const sendMessage = new SendMessage(chatRepository);

const chatController = new ChatController(createChat, deleteChat, getMessage, getuserChats, markMessageAsRead, sendMessage)

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat management APIs
 */

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
  } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
router.get("/:chatId/messages",async (req, res, next) => {
    try {
        await chatController.getMessages(req, res, next);
    } catch (err) {
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
router.patch("/read/:messageId", async (req, res, next) => {
    try {
        await chatController.markMessageAsRead(req, res, next);
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
        next(err);
    }
});

export { router as chatRoutes };
