"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const calenderModel = new mongoose_1.default.Schema({
    recipeId: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: 'Recipe',
    },
    recipeName: { type: String },
    userId: { type: mongoose_1.default.SchemaTypes.ObjectId, ref: 'User' },
    completed: { type: Boolean, default: false },
    date: { type: Date },
});
const Calender = mongoose_1.default.model('Calender', calenderModel);
exports.default = Calender;
