"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    description: { type: String, required: true },
    authorId: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'User' },
    authorName: { type: String, required: true },
    likes: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'Comment' }],
    date: {
        type: Date,
        default: Date.now,
    },
    images: { type: Array, default: [] },
});
const Post = mongoose_1.default.model('Post', postSchema);
exports.default = Post;
