"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    postId: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'Post',
        required: true,
    },
    likes: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'User' }],
    date: {
        type: Date,
        default: Date.now,
    },
});
const Comment = mongoose_1.default.model('Comment', commentModel);
exports.default = Comment;
