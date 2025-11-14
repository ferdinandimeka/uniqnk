import { Chat } from "../entities/Chat";
import { ChatMessage } from "../entities/ChatMessage";
import { Types } from "mongoose";

export interface ChatRepository {
  /**
   * Get all chats
   */
  getAllChats(): Promise<Chat[]>;

  /**
   * Find all chats that a user participates in
   */
  getUserChats(userId: string): Promise<Chat[]>;

  /**
   * Create a new chat with participants
   */
  createChat(participants: string[]): Promise<Chat>;

  /**
   * Add a message to an existing chat
   */
  sendMessage(chatId: string, sender: string, receiver: string, text?: string, mediaUrls?: string[]): Promise<Chat | null>;

  /**
   * Get all messages from a chat
   */
  getMessages(chatId: string): Promise<Chat | null>;

   /**
   * Get all messages by chat
   */
  getAllMessage(chatId: string): Promise<ChatMessage[] | []>;

  /**
   * Mark a specific message as read
   */
  markMessageAsRead(messageId: string): Promise<Chat | null>;

  /**
   * Delete a chat by ID
   */
  deleteChat(chatId: string): Promise<void>;

  /**
   * Delete a specific message
   */
  deleteMessage(chatId: string, messageId: string): Promise<boolean>;
}
