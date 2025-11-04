"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
class Chat {
    constructor(id, participants, // user IDs
    lastMessage = [], createdAt = new Date(), updatedAt = new Date()) {
        this.id = id;
        this.participants = participants;
        this.lastMessage = lastMessage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
            if (!msg.sender)
                throw new Error("Each message must have a sender.");
            if (!msg.text && (!msg.mediaUrls || msg.mediaUrls.length === 0)) {
                throw new Error("Each message must contain text or media.");
            }
        });
    }
    /**
     * Add a new message to the chat
     */
    addMessage(sender, text, mediaUrls) {
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
    markMessageAsRead(index) {
        if (index < 0 || index >= this.lastMessage.length) {
            throw new Error("Invalid message index.");
        }
        this.lastMessage[index].isRead = true;
        this.updatedAt = new Date();
    }
}
exports.Chat = Chat;
