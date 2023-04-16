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
exports.newRecipeComment = exports.postNewComment = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const recipeCommentModel_1 = __importDefault(require("../models/recipeCommentModel"));
function postNewComment(comment, userId, postId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findById(userId).select('name');
        const newComment = new commentModel_1.default({
            comment,
            postId,
            author: user === null || user === void 0 ? void 0 : user._id,
        });
        yield newComment.save();
        yield postModel_1.default.findByIdAndUpdate(postId, {
            $push: {
                comments: { _id: newComment._id },
            },
        });
        // I need to return comments populated but I couldn't do it with newComment
        // variable so I had to create and return getNewComments
        const getNewComment = yield commentModel_1.default.findById(newComment._id).populate('author', '_id name avatar');
        return getNewComment;
    });
}
exports.postNewComment = postNewComment;
function newRecipeComment(user, comment, rating, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const recipeComment = new recipeCommentModel_1.default({
            createdBy: user,
            comment,
            recipeId: id,
            rating,
        });
        yield recipeComment.save();
        const getNewComment = yield recipeCommentModel_1.default.findById(recipeComment._id).populate('createdBy', '_id name avatar title');
        return getNewComment;
    });
}
exports.newRecipeComment = newRecipeComment;
