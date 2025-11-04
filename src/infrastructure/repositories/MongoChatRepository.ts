import { ChatRepository } from "../../domain/interfaces/chatRepository";
import { Chat } from "../../domain/entities/Chat";
import { ChatModel } from "../models/ChatModel";
import { ChatMessageModel, IChatMessage } from "../models/MessageModel";
import mongoose, { Types } from "mongoose";

export class MongoChatRepository implements ChatRepository {
  /**
   * Convert a Mongoose Chat document into a domain Chat entity
   */
  private toDomain(chatDoc: any): Chat {
    return new Chat(
      chatDoc._id.toString(),
      chatDoc.participants.map((p: mongoose.Types.ObjectId) => p.toString()),
      chatDoc.lastMessage || [],
      chatDoc.createdAt,
      chatDoc.updatedAt
    );
  }

  /**
   * Find chat by ID
   */
  async findById(id: string): Promise<Chat | null> {
    const chatDoc = await ChatModel.findById(id).populate("lastMessage").exec();
    return chatDoc ? this.toDomain(chatDoc) : null;
  }

   /**
   * Get all chats
   */
  async getAllChats(): Promise<Chat[]> {
    const chatDocs = await ChatModel.find();
    return chatDocs.map((doc) => this.toDomain(doc));
  }

  /**
   * Find chats for a specific user
   */
  async getUserChats(userId: string): Promise<Chat[]> {
    const chats = await ChatModel.find({ participants: userId })
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .exec();

    return chats.map((chat) => this.toDomain(chat));
  }

  /**
   * Create a new chat
   */
  async createChat(participants: string[]): Promise<Chat> {
    const chatDoc = await ChatModel.create({
      participants: participants.map((id) => new mongoose.Types.ObjectId(id)),
    });

    return this.toDomain(chatDoc);
  }

  /**
   * Send a message (text and/or media)
   */
  async sendMessage(
    chatId: string,
    sender: string,
    receiver: string,
    text?: string,
    mediaUrls?: string[]
  ): Promise<Chat | null> {
    const chat = await ChatModel.findById(chatId);
    if (!chat) return null;

    // append new message
    const newMessage = await ChatMessageModel.create({
      chatId,
      sender,
      receiver,
      text,
      mediaUrls,
      isRead: false,
      // createdAt: new Date(),
    });

    // if using embedded messages (not separate collection)
    const updatedChat = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: { lastMessage: newMessage._id },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    return updatedChat ? this.toDomain(updatedChat) : null;
  }

  /**
   * Retrieve messages of a chat
   */
  async getMessages(chatId: string): Promise<Chat | null> {
    const chatDoc = await ChatModel.findById(chatId).populate("lastMessage").exec();
    return chatDoc ? this.toDomain(chatDoc) : null;
  }

  /**
   * Mark message as read
   */
    async markMessageAsRead(messageId: string): Promise<Chat | null> {
        const chatDoc = await ChatModel.findOneAndUpdate(
            { "lastMessage._id": messageId },
            { $set: { "lastMessage.$.isRead": true } },
            { new: true }
        );
        return chatDoc ? this.toDomain(chatDoc) : null;
    }


  /**
   * Delete a chat
   */
  async deleteChat(chatId: string): Promise<void> {
    await ChatModel.findByIdAndDelete(chatId);
  }

 /**
   * Delete a specific message in a chat
   */
  async deleteMessage(chatId: string, messageId: string): Promise<boolean> {
    // Validate IDs
    if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(messageId)) {
      throw new Error("Invalid chatId or messageId");
    }

    // Find and delete the message
    const deletedMessage = await ChatMessageModel.findOneAndDelete({
      _id: messageId,
      chatId,
    });

    if (!deletedMessage) {
      return false; // message not found or doesn't belong to the chat
    }

    // Check if the deleted message was the last message in the chat
    const chat = await ChatModel.findById(chatId);
    if (!chat) return false;
    if (chat?.lastMessage?.toString() === messageId) {
      // Get the most recent remaining message
      const latestMessage: IChatMessage | null = await ChatMessageModel.findOne({ chatId })
        .sort({ createdAt: -1 })
        .select("_id");

      // Update chat with new lastMessage (or null if no messages left)
      chat.lastMessage = latestMessage ? (latestMessage._id as Types.ObjectId) : undefined;
      await chat.save();
    }

    return true;
  }
}
