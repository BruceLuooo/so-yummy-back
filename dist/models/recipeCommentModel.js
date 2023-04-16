"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const recipeCommentSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    recipeId: { type: String },
    comment: { type: String },
    rating: { type: Number },
    date: { type: Date, default: Date.now },
});
const RecipeComment = mongoose_1.default.model('RecipeComment', recipeCommentSchema);
exports.default = RecipeComment;
