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
exports.unlikeComment = exports.likeComment = exports.recipeComment = exports.postComment = exports.getRecipeComments = exports.getCommentLikes = exports.didUserAlreadyLikeComment = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
const recipeCommentModel_1 = __importDefault(require("../models/recipeCommentModel"));
const commentService_1 = require("../service/commentService");
//get
function didUserAlreadyLikeComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const post = yield commentModel_1.default.findOne({ _id: id, likes: req.user });
        if (post) {
            return res.status(200).json({ status: true });
        }
        else {
            return res.status(200).json({ status: false });
        }
    });
}
exports.didUserAlreadyLikeComment = didUserAlreadyLikeComment;
function getCommentLikes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const likes = yield commentModel_1.default.findById(id)
            .populate('likes', 'avatar _id name')
            .select('likes');
        return res.status(200).send(likes);
    });
}
exports.getCommentLikes = getCommentLikes;
function getRecipeComments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const comments = yield recipeCommentModel_1.default.find({ recipeId: id })
                .sort({ date: -1 })
                .populate('createdBy', '_id name avatar title');
            return res.status(200).send(comments);
        }
        catch (error) {
            return res.status(400).send(error);
        }
    });
}
exports.getRecipeComments = getRecipeComments;
//post
function postComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { comment } = req.body;
        try {
            const newComment = yield (0, commentService_1.postNewComment)(comment, req.user, id);
            const final = Object.assign(Object.assign({}, newComment._doc), { likes: newComment.likes.length });
            return res.status(200).json(final);
        }
        catch (error) {
            return res.status(401).send(error);
        }
    });
}
exports.postComment = postComment;
function recipeComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { comment, rating } = req.body;
        const { recipeId } = req.params;
        try {
            const recipeComment = yield (0, commentService_1.newRecipeComment)(req.user, comment, rating, recipeId);
            return res.status(200).send(recipeComment);
        }
        catch (error) {
            return res.status(401).send(error);
        }
    });
}
exports.recipeComment = recipeComment;
//put
function likeComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        yield commentModel_1.default.findByIdAndUpdate(id, {
            $push: {
                likes: { _id: req.user },
            },
        });
        return res.status(200).send('Liked Comment');
    });
}
exports.likeComment = likeComment;
function unlikeComment(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        yield commentModel_1.default.findByIdAndUpdate(id, {
            $pull: {
                likes: req.user,
            },
        });
        return res.status(200).send('Unliked Comment');
    });
}
exports.unlikeComment = unlikeComment;
