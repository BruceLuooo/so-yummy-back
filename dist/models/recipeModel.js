"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const recipeSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    recipeName: { type: String },
    description: { type: String },
    cookTime: { type: Number },
    prepTime: { type: Number },
    servings: { type: Number },
    ingredients: [
        {
            id: { type: Number },
            ingredient: { type: String },
            type: { type: String },
            quantity: { type: Number },
            unit: { type: String },
        },
    ],
    instructions: [
        {
            id: { type: String },
            instruction: { type: String },
        },
    ],
    date: { type: Date, default: Date.now },
    savedBy: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'Recipe' }],
    images: { type: Array, default: [] },
});
const Recipe = mongoose_1.default.model('Recipe', recipeSchema);
exports.default = Recipe;
