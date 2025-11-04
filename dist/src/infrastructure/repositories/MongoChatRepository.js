"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoChatRepository = void 0;
const Chat_1 = require("../../domain/entities/Chat");
const ChatModel_1 = require("../models/ChatModel");
const MessageModel_1 = require("../models/MessageModel");
const mongoose_1 = __importStar(require("mongoose"));
class MongoChatRepository {
    /**
     * Convert a Mongoose Chat document into a domain Chat entity
     */
    toDomain(chatDoc) {
        return new Chat_1.Chat(chatDoc._id.toString(), chatDoc.participants.map((p) => p.toString()), chatDoc.lastMessage || [], chatDoc.createdAt, chatDoc.updatedAt);
    }
    /**
     * Find chat by ID
     */
    async findById(id) {
        const chatDoc = await ChatModel_1.ChatModel.findById(id).populate("lastMessage").exec();
        return chatDoc ? this.toDomain(chatDoc) : null;
    }
    /**
    * Get all chats
    */
    async getAllChats() {
        const chatDoc = await ChatModel_1.ChatModel.find();
        return chatDoc ? this.toDomain(chatDoc) : null;
    }
    /**
     * Find chats for a specific user
     */
    async getUserChats(userId) {
        const chats = await ChatModel_1.ChatModel.find({ participants: userId })
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
            .exec();
        return chats.map((chat) => this.toDomain(chat));
    }
    /**
     * Create a new chat
     */
    async createChat(participants) {
        const chatDoc = await ChatModel_1.ChatModel.create({
            participants: participants.map((id) => new mongoose_1.default.Types.ObjectId(id)),
        });
        return this.toDomain(chatDoc);
    }
    /**
     * Send a message (text and/or media)
     */
    async sendMessage(chatId, sender, receiver, text, mediaUrls) {
        const chat = await ChatModel_1.ChatModel.findById(chatId);
        if (!chat)
            return null;
        // append new message
        const newMessage = await MessageModel_1.ChatMessageModel.create({
            chatId,
            sender,
            receiver,
            text,
            mediaUrls,
            isRead: false,
            // createdAt: new Date(),
        });
        // if using embedded messages (not separate collection)
        const updatedChat = await ChatModel_1.ChatModel.findByIdAndUpdate(chatId, {
            $push: { lastMessage: newMessage._id },
            $set: { updatedAt: new Date() },
        }, { new: true });
        return updatedChat ? this.toDomain(updatedChat) : null;
    }
    /**
     * Retrieve messages of a chat
     */
    async getMessages(chatId) {
        const chatDoc = await ChatModel_1.ChatModel.findById(chatId).populate("lastMessage").exec();
        return chatDoc ? this.toDomain(chatDoc) : null;
    }
    /**
     * Mark message as read
     */
    async markMessageAsRead(messageId) {
        const chatDoc = await ChatModel_1.ChatModel.findOneAndUpdate({ "lastMessage._id": messageId }, { $set: { "lastMessage.$.isRead": true } }, { new: true });
        return chatDoc ? this.toDomain(chatDoc) : null;
    }
    /**
     * Delete a chat
     */
    async deleteChat(chatId) {
        await ChatModel_1.ChatModel.findByIdAndDelete(chatId);
    }
    /**
      * Delete a specific message in a chat
      */
    async deleteMessage(chatId, messageId) {
        // Validate IDs
        if (!mongoose_1.Types.ObjectId.isValid(chatId) || !mongoose_1.Types.ObjectId.isValid(messageId)) {
            throw new Error("Invalid chatId or messageId");
        }
        // Find and delete the message
        const deletedMessage = await MessageModel_1.ChatMessageModel.findOneAndDelete({
            _id: messageId,
            chatId,
        });
        if (!deletedMessage) {
            return false; // message not found or doesn't belong to the chat
        }
        // Check if the deleted message was the last message in the chat
        const chat = await ChatModel_1.ChatModel.findById(chatId);
        if (!chat)
            return false;
        if (chat?.lastMessage?.toString() === messageId) {
            // Get the most recent remaining message
            const latestMessage = await MessageModel_1.ChatMessageModel.findOne({ chatId })
                .sort({ createdAt: -1 })
                .select("_id");
            // Update chat with new lastMessage (or null if no messages left)
            chat.lastMessage = latestMessage ? latestMessage._id : undefined;
            await chat.save();
        }
        return true;
    }
}
exports.MongoChatRepository = MongoChatRepository;
