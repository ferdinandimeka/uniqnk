export class ChatMessage {
  constructor(
    public readonly id: string,
    public readonly chatId: string,
    public readonly sender: string,
    public readonly receiver?: string,
    public readonly text?: string,
    public readonly mediaUrls?: string[],
    public readonly isRead: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {
    // --- Validation logic ---
    if (!chatId) throw new Error("Chat ID is required for a message.");
    if (!sender) throw new Error("Sender ID is required for a message.");

    if (!text && (!mediaUrls || mediaUrls.length === 0)) {
      throw new Error("Message must contain either text or media.");
    }

    // Ensure data types are correct
    if (typeof chatId !== "string" || typeof sender !== "string") {
      throw new Error("Chat ID and sender must be strings.");
    }
  }

  /**
   * Mark this message as read
   */
  markAsRead(): ChatMessage {
    return new ChatMessage(
      this.id,
      this.chatId,
      this.sender,
      this.receiver,
      this.text,
      this.mediaUrls,
      true,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Convert message to a plain object (useful for serialization)
   */
  toJSON() {
    return {
      id: this.id,
      chatId: this.chatId,
      sender: this.sender,
      receiver: this.receiver,
      text: this.text,
      mediaUrls: this.mediaUrls,
      isRead: this.isRead,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
