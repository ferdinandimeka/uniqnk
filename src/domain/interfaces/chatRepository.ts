import { Chat } from "../entities/Chat";
import { Types } from "mongoose";

export interface ChatRepository {
  /**
   * Find a chat by ID
   */
//   findById(id: string): Promise<Chat | null>;

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
  sendMessage(chatId: string, sender: string, text?: string, mediaUrls?: string[]): Promise<Chat | null>;

  /**
   * Get all messages from a chat
   */
  getMessages(chatId: string): Promise<Chat | null>;

  /**
   * Mark a specific message as read
   */
  markMessageAsRead(chatId: string): Promise<Chat | null>;

  /**
   * Delete a chat by ID
   */
  deleteChat(chatId: string): Promise<void>;

  /**
   * Delete a specific message
   */
  deleteMessage(chatId: string, messageIndex: number): Promise<Chat | null>;
}
