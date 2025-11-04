"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const socket_1 = require("../../socket"); // ✅ Import Socket helper
const constants_1 = require("../../constants"); // ✅ Socket event names
class ChatController {
    constructor(
    // private addCommentUseCase,
    createChatUseCase, deleteChatUseCase, deleteChatMessageUseCase, getMessagesUseCase, getUserChatUseCase, markMessageAsReadUseCase, sendMessageUseCase, getAllChats) {
        this.createChatUseCase = createChatUseCase;
        this.deleteChatUseCase = deleteChatUseCase;
        this.deleteChatMessageUseCase = deleteChatMessageUseCase;
        this.getMessagesUseCase = getMessagesUseCase;
        this.getUserChatUseCase = getUserChatUseCase;
        this.markMessageAsReadUseCase = markMessageAsReadUseCase;
        this.sendMessageUseCase = sendMessageUseCase;
        this.getAllChats = getAllChats;
    }
    /** Get all chat */
    async getAllChat(req, res, next) {
        const chats = await this.getAllChats.execute();
        res.json(chats);
        next();
    }
    /** ✅ Create or get existing chat between users */
    async createChat(req, res, next) {
        try {
            const { participants } = req.body;
            if (!participants || participants.length < 2) {
                return res.status(400).json({ message: "At least two participants required" });
            }
            const objectIds = participants.map((id) => new mongoose_1.default.Types.ObjectId(id));
            const chat = await this.createChatUseCase.execute(objectIds);
            // 🎯 Notify participants (except sender)
            (0, socket_1.emitSocketEvent)(req, chat.id.toString(), constants_1.ChatEventEnum.NEW_CHAT_EVENT, chat);
            return res.status(200).json({ success: true, data: chat });
        }
        catch (error) {
            console.error("Error creating chat:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    /** ✅ Send a message (text or media) */
    async sendMessage(req, res, next) {
        try {
            const { chatId, receiver, sender, text, mediaUrls } = req.body;
            if (!chatId || !sender || (!text && (!mediaUrls || mediaUrls.length === 0))) {
                return res.status(400).json({ message: "chatId, sender and text or media required" });
            }
            const message = await this.sendMessageUseCase.execute({
                chatId,
                receiver,
                sender,
                text,
                mediaUrls
            });
            if (message) {
                // 🎯 Broadcast message to all participants in the chat room
                (0, socket_1.emitSocketEvent)(req, chatId, constants_1.ChatEventEnum.MESSAGE_RECEIVED_EVENT, message);
            }
            return res.status(201).json({ success: true, data: message });
        }
        catch (error) {
            console.error("Error sending message:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    /** ✅ Get all messages in a chat */
    async getMessages(req, res, next) {
        try {
            const { chatId } = req.params;
            if (!chatId) {
                return res.status(400).json({ message: "Chat ID is required" });
            }
            const messages = await this.getMessagesUseCase.execute(chatId);
            return res.status(200).json({ success: true, data: messages });
        }
        catch (error) {
            console.error("Error fetching messages:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    /** ✅ Get all chats for a user (with last message preview) */
    async getUserChats(req, res, next) {
        try {
            const { userId } = req.params;
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
            const chats = await this.getUserChatUseCase.execute(userId);
            return res.status(200).json({ success: true, data: chats });
        }
        catch (error) {
            console.error("Error fetching user chats:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    /** ✅ Mark a message as read */
    async markMessageAsRead(req, res, next) {
        try {
            const { messageId } = req.params;
            if (!messageId) {
                return res.status(400).json({ message: "Message ID is required" });
            }
            const updatedChat = await this.markMessageAsReadUseCase.execute(messageId);
            if (updatedChat) {
                // 🎯 Emit socket event that message was read
                (0, socket_1.emitSocketEvent)(req, messageId, constants_1.ChatEventEnum.MESSAGE_READ_EVENT, {
                    messageId,
                });
            }
            return res.status(200).json({ success: true, message: "Message marked as read" });
        }
        catch (error) {
            console.error("Error marking message as read:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    /** ✅ Delete a chat */
    async deleteChat(req, res, next) {
        try {
            const { chatId } = req.params;
            if (!chatId) {
                return res.status(400).json({ message: "Chat ID is required" });
            }
            await this.deleteChatUseCase.execute((chatId));
            // 🎯 Emit chat deleted event
            (0, socket_1.emitSocketEvent)(req, chatId, constants_1.ChatEventEnum.CHAT_DELETED_EVENT, { chatId });
            return res.status(200).json({ success: true, message: "Chat deleted successfully" });
        }
        catch (error) {
            console.error("Error deleting chat:", error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    /** ✅ Delete a message */
    async deleteMessage(req, res, next) {
        try {
            const { chatId, messageId } = req.params;
            if (!chatId || !messageId) {
                return res.status(400).json({ message: "Chat ID and Message ID are required" });
            }
            const success = await this.deleteChatMessageUseCase.execute(chatId, messageId);
            if (!success) {
                return res.status(404).json({ success: false, message: "Message not found or already deleted" });
            }
            // 🎯 Notify both sender and receiver that the message was deleted
            (0, socket_1.emitSocketEvent)(req, chatId, constants_1.ChatEventEnum.MESSAGE_DELETED_EVENT, { messageId });
            return res.status(200).json({
                success: true,
                message: "Message deleted successfully",
            });
        }
        catch (error) {
            console.error("Error deleting message:", error);
            return res.status(500).json({
                success: false,
                message: error.message || "Internal Server Error",
            });
        }
    }
}
exports.ChatController = ChatController;
