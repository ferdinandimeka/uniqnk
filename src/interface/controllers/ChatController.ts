import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MongoChatRepository } from "../../infrastructure/repositories/MongoChatRepository";
import { CreateChat } from "../../use-cases/chat/createChat";
import { DeleteChat } from "../../use-cases/chat/deleteChat";
import { DeleteChatMessage } from "../../use-cases/chat/deleteChatMessage";
import { GetMessages } from "../../use-cases/chat/getMessages";
import { GetUserChats } from "../../use-cases/chat/getUserChats";
import { GetAllChats } from "../../use-cases/chat/getAllChat";
import { MarkMessageAsRead } from "../../use-cases/chat/markMessageAsRead";
import { SendMessage } from "../../use-cases/chat/sendMessage";
import { emitSocketEvent } from "../../socket"; // ✅ Import Socket helper
import { ChatEventEnum } from "../../constants"; // ✅ Socket event names

export class ChatController {
    constructor(
        // private addCommentUseCase,
        private createChatUseCase: CreateChat, 
        private deleteChatUseCase: DeleteChat,
        private deleteChatMessageUseCase: DeleteChatMessage,
        private getMessagesUseCase: GetMessages,
        private getUserChatUseCase: GetUserChats,
        private markMessageAsReadUseCase: MarkMessageAsRead,
        private sendMessageUseCase: SendMessage,
        private getAllChats: GetAllChats
    ) {}
  /** Get all chat */
  async getAllChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    const chats = await this.getAllChats.execute();
      res.json(chats);
      next();
  }

  /** ✅ Create or get existing chat between users */
  async createChat(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { participants } = req.body;

      if (!participants || participants.length < 2) {
        return res.status(400).json({ message: "At least two participants required" });
      }

      const objectIds = participants.map((id: string) => new mongoose.Types.ObjectId(id));
      const chat = await this.createChatUseCase.execute(objectIds);

      // 🎯 Notify participants (except sender)
      emitSocketEvent(req, chat.id.toString(), ChatEventEnum.NEW_CHAT_EVENT, chat);

      return res.status(200).json({ success: true, data: chat });
    } catch (error: any) {
      console.error("Error creating chat:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /** ✅ Send a message (text or media) */
  async sendMessage(req: Request, res: Response, next: NextFunction): Promise<Response> {
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
        emitSocketEvent(req, chatId, ChatEventEnum.MESSAGE_RECEIVED_EVENT, message);
      }

      return res.status(201).json({ success: true, data: message });
    } catch (error: any) {
      console.error("Error sending message:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /** ✅ Get all messages in a chat */
  async getMessages(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { chatId } = req.params;

      if (!chatId) {
        return res.status(400).json({ message: "Chat ID is required" });
      }

      const messages = await this.getMessagesUseCase.execute(chatId);

      return res.status(200).json({ success: true, data: messages });
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /** ✅ Get all chats for a user (with last message preview) */
  async getUserChats(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const chats = await this.getUserChatUseCase.execute(userId);

      return res.status(200).json({ success: true, data: chats });
    } catch (error: any) {
      console.error("Error fetching user chats:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /** ✅ Mark a message as read */
  async markMessageAsRead(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { messageId } = req.params;

      if (!messageId) {
        return res.status(400).json({ message: "Message ID is required" });
      }

      const updatedChat = await this.markMessageAsReadUseCase.execute(messageId);

      if (updatedChat) {
        // 🎯 Emit socket event that message was read
        emitSocketEvent(req, messageId, ChatEventEnum.MESSAGE_READ_EVENT, {
          messageId,
        });
      }

      return res.status(200).json({ success: true, message: "Message marked as read" });
    } catch (error: any) {
      console.error("Error marking message as read:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /** ✅ Delete a chat */
  async deleteChat(req: Request, res: Response, next: NextFunction): Promise<Response> {
    try {
      const { chatId } = req.params;

      if (!chatId) {
        return res.status(400).json({ message: "Chat ID is required" });
      }

      await this.deleteChatUseCase.execute((chatId));

      // 🎯 Emit chat deleted event
      emitSocketEvent(req, chatId, ChatEventEnum.CHAT_DELETED_EVENT, { chatId });

      return res.status(200).json({ success: true, message: "Chat deleted successfully" });
    } catch (error: any) {
      console.error("Error deleting chat:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  /** ✅ Delete a message */
  async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<Response> {
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
      emitSocketEvent(req, chatId, ChatEventEnum.MESSAGE_DELETED_EVENT, { messageId });

      return res.status(200).json({
        success: true,
        message: "Message deleted successfully",
      });
    } catch (error: any) {
      console.error("Error deleting message:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

}
