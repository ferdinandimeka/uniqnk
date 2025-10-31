export class Chat {
  constructor(
    public readonly id: string,
    public participants: string[], // user IDs
    public lastMessage: {
      sender: string;
      text?: string;
      mediaUrls?: string[];
      isRead: boolean;
      createdAt: Date;
    }[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {
    // Validate participants
    if (!participants || participants.length < 2) {
      throw new Error("A chat must have at least two participants.");
    }

    // Ensure IDs are strings
    participants.forEach((p) => {
      if (typeof p !== "string") {
        throw new Error("Participant IDs must be strings.");
      }
    });

    // Validate messages array
    this.lastMessage.forEach((msg) => {
      if (!msg.sender) throw new Error("Each message must have a sender.");
      if (!msg.text && (!msg.mediaUrls || msg.mediaUrls.length === 0)) {
        throw new Error("Each message must contain text or media.");
      }
    });
  }

  /**
   * Add a new message to the chat
   */
  addMessage(sender: string, text?: string, mediaUrls?: string[]) {
    if (!text && (!mediaUrls || mediaUrls.length === 0)) {
      throw new Error("Message must contain either text or media.");
    }

    const newMessage = {
      sender,
      text,
      mediaUrls,
      isRead: false,
      createdAt: new Date(),
    };

    this.lastMessage.push(newMessage);
    this.updatedAt = new Date();
  }

  /**
   * Mark a message as read
   */
  markMessageAsRead(index: number) {
    if (index < 0 || index >= this.lastMessage.length) {
      throw new Error("Invalid message index.");
    }
    this.lastMessage[index].isRead = true;
    this.updatedAt = new Date();
  }
}
