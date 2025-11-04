"use strict";
// import { PostRepository } from "../../domain/interfaces/postRepository";
// import { Post } from "../../domain/entities/Post";
// import mongoose from "mongoose";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLike = void 0;
class AddLike {
    constructor(postRepository) {
        this.postRepository = postRepository;
    }
    async execute(postId, userId) {
        return this.postRepository.addLike(postId, userId);
    }
}
exports.AddLike = AddLike;
