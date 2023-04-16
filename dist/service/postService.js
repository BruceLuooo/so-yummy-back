"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewPostToDatabase = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
function addNewPostToDatabase(userId, description, imageUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield userModel_1.default.findById(userId).select('_id name ');
        const newPost = new postModel_1.default({
            authorId: profile._id,
            description,
            authorName: profile.name,
            images: imageUrls,
        });
        yield newPost.save();
        const getNewPost = yield postModel_1.default.findById(newPost._id).populate('authorId');
        return getNewPost;
    });
}
exports.addNewPostToDatabase = addNewPostToDatabase;
