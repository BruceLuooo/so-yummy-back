"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    title: { type: String, default: '' },
    bio: { type: String, default: '' },
    follower: { type: Array, default: [] },
    following: { type: Array, default: [] },
    personalRecipes: [{ type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'Recipe' }],
    likedPosts: { type: Array, default: [] },
    community: { type: Boolean, default: false },
    avatar: {
        type: String,
        default: 'https://cdn.discordapp.com/attachments/1007742096104497163/1013499279681277952/unknown.png',
    },
    allInventory: [
        {
            ingredient: { type: String, required: true },
            unit: { type: String },
            quantity: { type: Number, required: true },
            type: { type: String, required: true },
        },
    ],
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
