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
exports.unlikePost = exports.likePost = exports.getMoreRandomNewsFeed = exports.getRandomNewsFeed = exports.getMoreUsersNewsFeed = exports.getUsersNewsFeed = exports.getPostLikes = exports.getMorePostComments = exports.getPostComments = exports.didUserAlreadyLike = exports.getMoreUsersPost = exports.getUsersPost = exports.createNewPost = void 0;
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const cloudinary_1 = require("cloudinary");
const postService_1 = require("../service/postService");
const mongoose_1 = __importDefault(require("mongoose"));
//post
function createNewPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
        });
        const { description } = req.body;
        const imageUrls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = yield cloudinary_1.v2.uploader.upload(path);
            imageUrls.push(newPath.url);
        }
        const newPost = yield (0, postService_1.addNewPostToDatabase)(req.user, description, imageUrls);
        res.send(newPost);
    });
}
exports.createNewPost = createNewPost;
//get
function getUsersPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const query = { authorId: id };
        const findPosts = yield postModel_1.default.find(query)
            .populate('authorId', 'title _id avatar')
            .sort({ date: 'desc' })
            .limit(3);
        const posts = findPosts.map((post) => {
            return Object.assign(Object.assign({}, post._doc), { comments: post.comments.length, likes: post.likes.length });
        });
        return res.status(200).json({ posts });
    });
}
exports.getUsersPost = getUsersPost;
function getMoreUsersPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { page } = req.query;
        const query = { authorId: id };
        const findPosts = yield postModel_1.default.find(query)
            .populate('authorId', 'title _id avatar')
            .sort({ date: 'desc' })
            .skip((parseInt(page) - 1) * 3)
            .limit(3);
        const posts = findPosts.map((post) => {
            return Object.assign(Object.assign({}, post._doc), { comments: post.comments.length, likes: post.likes.length });
        });
        return res.status(200).json(posts);
    });
}
exports.getMoreUsersPost = getMoreUsersPost;
function didUserAlreadyLike(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const post = yield postModel_1.default.findOne({
            _id: id,
            likes: req.user,
        }).select('likes');
        if (post) {
            return res.status(200).json({ status: true });
        }
        else {
            return res.status(200).json({ status: false });
        }
    });
}
exports.didUserAlreadyLike = didUserAlreadyLike;
function getPostComments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const findComments = yield commentModel_1.default.find({ postId: id })
            .populate('author', 'name _id avatar')
            .sort({ date: 'desc' })
            .limit(5);
        const comments = findComments.map((comment) => {
            return Object.assign(Object.assign({}, comment._doc), { likes: comment.likes.length });
        });
        res.status(200).json(comments);
    });
}
exports.getPostComments = getPostComments;
function getMorePostComments(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { page } = req.query;
        const findComments = yield commentModel_1.default.find({ postId: id })
            .populate('author', 'name _id avatar')
            .sort({ date: 'desc' })
            .limit(5)
            .skip((parseInt(page) - 1) * 5);
        const comments = findComments.map((comment) => {
            return Object.assign(Object.assign({}, comment._doc), { likes: comment.likes.length });
        });
        res.status(200).json(comments);
    });
}
exports.getMorePostComments = getMorePostComments;
function getPostLikes(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const likes = yield postModel_1.default.findById(id)
            .select('likes -_id')
            .populate('likes', 'avatar _id name');
        return res.status(200).json(likes);
    });
}
exports.getPostLikes = getPostLikes;
function getUsersNewsFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = yield postModel_1.default.aggregate([
            { $addFields: { author: { $toString: '$authorId' } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: 'following.id',
                    as: 'relationship',
                },
            },
            {
                $match: {
                    'relationship._id': mongoose_1.default.Types.ObjectId(req.user),
                },
            },
        ])
            .sort({ date: 'desc' })
            .limit(5);
        yield postModel_1.default.populate(posts, { path: 'authorId', select: 'title _id avatar' });
        const results = posts.map((post) => {
            return Object.assign(Object.assign({}, post), { comments: post.comments.length, likes: post.likes.length });
        });
        res.send(results);
    });
}
exports.getUsersNewsFeed = getUsersNewsFeed;
function getMoreUsersNewsFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page } = req.query;
        const posts = yield postModel_1.default.aggregate([
            { $addFields: { author: { $toString: '$authorId' } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: 'following.id',
                    as: 'relationship',
                },
            },
            {
                $match: {
                    'relationship._id': mongoose_1.default.Types.ObjectId(req.user),
                },
            },
        ])
            .sort({ date: 'desc' })
            .skip((parseInt(page) - 1) * 5)
            .limit(5);
        yield postModel_1.default.populate(posts, { path: 'authorId', select: 'title _id avatar' });
        const results = posts.map((post) => {
            return Object.assign(Object.assign({}, post), { comments: post.comments.length, likes: post.likes.length });
        });
        res.send(results);
    });
}
exports.getMoreUsersNewsFeed = getMoreUsersNewsFeed;
function getRandomNewsFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const findPosts = yield postModel_1.default.find({})
            .populate('authorId', 'title _id avatar')
            .sort({ likes: -1 })
            .limit(5);
        const posts = findPosts.map((post) => {
            return Object.assign(Object.assign({}, post._doc), { comments: post.comments.length, likes: post.likes.length });
        });
        res.send(posts);
    });
}
exports.getRandomNewsFeed = getRandomNewsFeed;
function getMoreRandomNewsFeed(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { page } = req.query;
        const findPosts = yield postModel_1.default.find({})
            .populate('authorId', 'title _id avatar')
            .sort({ likes: -1 })
            .skip((parseInt(page) - 1) * 5)
            .limit(5);
        const posts = findPosts.map((post) => {
            return Object.assign(Object.assign({}, post._doc), { comments: post.comments.length, likes: post.likes.length });
        });
        res.send(posts);
    });
}
exports.getMoreRandomNewsFeed = getMoreRandomNewsFeed;
//put
function likePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        yield postModel_1.default.findByIdAndUpdate(id, {
            $push: {
                likes: req.user,
            },
        });
        yield userModel_1.default.findByIdAndUpdate(req.user, {
            $push: {
                likedPosts: { _id: id },
            },
        });
        res.status(200).send('user liked');
    });
}
exports.likePost = likePost;
function unlikePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        yield postModel_1.default.findByIdAndUpdate(id, {
            $pull: {
                likes: req.user,
            },
        });
        yield userModel_1.default.findByIdAndUpdate(req.user, {
            $pull: {
                likedPosts: { _id: id },
            },
        });
        res.status(200).send('user unliked');
    });
}
exports.unlikePost = unlikePost;
