"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    participants: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true }],
    lastMessage: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "ChatMessage" },
}, { timestamps: true });
exports.ChatModel = mongoose_1.default.model("Chat", ChatSchema);
