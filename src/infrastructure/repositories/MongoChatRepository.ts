import { ChatRepository } from "../../domain/interfaces/chatRepository";
import { Chat } from "../../domain/entities/Chat";
import { ChatModel } from "../models/ChatModel";
import { ChatMessageModel, IChatMessage } from "../models/MessageModel";
import mongoose, { Types } from "mongoose";
import { ChatMessage } from "../../domain/entities/ChatMessage"

export class MongoChatRepository implements ChatRepository {
  /**
   * Convert a Mongoose Chat document into a domain Chat entity
   */

  private toDomain(chatDoc: any): Chat {
  let lastMessages = [];

  if (chatDoc.lastMessage) {
    // If it's a single object (from populate), wrap it in an array
    if (!Array.isArray(chatDoc.lastMessage)) {
      lastMessages = [chatDoc.lastMessage];
    } else {
      lastMessages = chatDoc.lastMessage;
    }

    // Transform each message into the structure expected by Chat
    lastMessages = lastMessages.map((msg: any) => ({
      sender: msg.sender?.toString(),
      receiver: msg.receiver?.toString(), // ✅ FIXED
      text: msg.text,
      mediaUrls: msg.mediaUrls || [],
      isRead: msg.isRead,
      createdAt: msg.createdAt,
    }));
  }
      // Return a Chat class instance, not a plain object
    const chat = new Chat(
      chatDoc._id.toString(),
      chatDoc.participants?.map((p: any) => p.toString()) || [],
      lastMessages,
      chatDoc.createdAt,
      chatDoc.updatedAt
    );

    return chat;
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
    const chatDocs = await ChatModel.find().populate("lastMessage");
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
    console.log("lastMessage type:", chat?.lastMessage);
    console.log("sendMessage input:", { chatId, sender, receiver, text });
    if (!chat) return null;

    // append new message
    const newMessage = await ChatMessageModel.create({
      chatId,
      receiver: receiver,
      sender: sender,
      text,
      mediaUrls,
      isRead: false,
      // createdAt: new Date(),
    });

    console.log("New message created:", newMessage);

    // Update chat with new lastMessage
  await ChatModel.findByIdAndUpdate(chatId, {
    $set: { lastMessage: newMessage._id, updatedAt: new Date() },
  });

     // ✅ Populate lastMessage before returning
    const updatedChat = await ChatModel.findById(chatId).populate("lastMessage");

    console.log("Populated chat:", JSON.stringify(updatedChat, null, 2));

    return updatedChat ? this.toDomain(updatedChat) : null;
  }

  /**
   * Retrieve message of a chat
   */
  async getMessages(chatId: string): Promise<Chat | null> {
    const chatDoc = await ChatModel.findById(chatId).populate("lastMessage").exec();
    return chatDoc ? this.toDomain(chatDoc) : null;
  }

  // async getAllMessage(chatId: string): Promise<Chat[] | []> {
  //   const chatDocs =  await ChatMessageModel.find({ chatId }).sort({ createdAt: 1 });
  //   return chatDocs.map((doc) => this.toDomain(doc));
  // }

  async getAllMessage(chatId: string): Promise<ChatMessage[]> {
    // Fetch all messages belonging to a chat
    const messageDocs = await ChatMessageModel.find({ chatId })
      .sort({ createdAt: 1 }) // oldest first
      .populate("sender receiver", "name avatar"); // optional: populate user info

    // Return raw message objects or map them to a Message domain entity
    // return messageDocs.map((doc) => this.toDomain(doc));
    return messageDocs.map((msg) => {
      // safely extract senderId
      const senderId =
        typeof msg.sender === "object" && msg.sender !== null && "_id" in msg.sender
          ? (msg.sender._id as unknown as Types.ObjectId).toString()
          : (msg.sender as unknown as Types.ObjectId)?.toString?.() ?? "";

      // safely extract receiverId (can be undefined)
      const receiverId =
        typeof msg.receiver === "object" && msg.receiver !== null && "_id" in msg.receiver
          ? (msg.receiver._id as unknown as Types.ObjectId).toString()
          : (msg.receiver as unknown as Types.ObjectId)?.toString?.() ?? undefined;

      return new ChatMessage(
        msg._id.toString(),
        msg.chatId.toString(),
        senderId,
        receiverId,
        msg.text,
        msg.mediaUrls,
        msg.isRead,
        msg.createdAt,
        msg.updatedAt
      );
    });
  }


  /**
   * Mark message as read
   */
   async markMessageAsRead(messageId: string): Promise<Chat | null> {
    const updatedMessage = await ChatMessageModel.findByIdAndUpdate(
      messageId,
      { isRead: true },
      { new: true }
    );

    if (!updatedMessage) return null;

    // If the message is the chat's lastMessage, update chat.updatedAt
    const chat = await ChatModel.findOne({ lastMessage: messageId });

    if (chat) {
      await ChatModel.findByIdAndUpdate(chat._id, {
        updatedAt: new Date(),
      });
    }

    return chat ? this.toDomain(chat) : null;
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
