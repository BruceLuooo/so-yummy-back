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
exports.updateProfilePicture = exports.addNewIngredientToInventory = exports.updateUserInformation = exports.unfollowUser = exports.followUser = exports.getTopCommunities = exports.getRandomRecommendedPeople = exports.getRecommendedPeople = exports.getIngredients = exports.getFollowing = exports.getFollowers = exports.checkFollowStatus = exports.getUserInformation = exports.createUserSessionHandler = exports.createUserHandler = void 0;
const userService_1 = require("../service/userService");
const jwt_1 = require("../helper/jwt");
const cloudinary_1 = require("cloudinary");
const userModel_1 = __importDefault(require("../models/userModel"));
// post
function createUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, userService_1.createUser)(req.body);
            const sessionToken = (0, jwt_1.generateToken)(user._id);
            return res.status(200).json({ userId: user._id, token: sessionToken });
        }
        catch (error) {
            return res.status(409).send(error.message);
        }
    });
}
exports.createUserHandler = createUserHandler;
function createUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        const user = yield (0, userService_1.validateEmailAndPassword)(email, password);
        if (!user) {
            return res.status(401).send('Invalid Email or Password');
        }
        const sessionToken = (0, jwt_1.generateToken)(user._id);
        return res.status(200).json({
            token: sessionToken,
            userId: user._id,
            profilePicture: user.avatar,
        });
    });
}
exports.createUserSessionHandler = createUserSessionHandler;
//get
function getUserInformation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const user = yield (0, userService_1.userInformation)(id);
        return res.status(200).json(user);
    });
}
exports.getUserInformation = getUserInformation;
function checkFollowStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const user = yield userModel_1.default.findOne({
            _id: req.user,
            'following.id': id,
        }).select('id');
        if (user) {
            return res.status(200).json({ status: true });
        }
        else {
            return res.status(200).json({ status: false });
        }
    });
}
exports.checkFollowStatus = checkFollowStatus;
function getFollowers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const followers = yield userModel_1.default.findOne({ _id: id }).select('follower');
        res.status(200).json(followers);
    });
}
exports.getFollowers = getFollowers;
function getFollowing(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const following = yield userModel_1.default.findOne({ _id: id }).select('following');
        res.status(200).json(following);
    });
}
exports.getFollowing = getFollowing;
function getIngredients(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, type } = req.params;
        const user = yield userModel_1.default.findById(id);
        const inventory = yield (0, userService_1.getUserInventoryInOrder)(user, type);
        if (inventory.length === 0) {
            res.status(200).send([]);
        }
        else {
            res.status(200).send(inventory);
        }
    });
}
exports.getIngredients = getIngredients;
function getRecommendedPeople(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findById(req.user);
        const following = user === null || user === void 0 ? void 0 : user.following.map(following => following.id);
        following === null || following === void 0 ? void 0 : following.push(req.user);
        const recommended = yield userModel_1.default.find({
            _id: { $nin: following },
        }).select('avatar _id name title');
        const rand = Math.floor(Math.random() * (recommended.length - 4));
        const recommendedPeople = recommended.slice(rand, rand + 3);
        res.send(recommendedPeople);
    });
}
exports.getRecommendedPeople = getRecommendedPeople;
function getRandomRecommendedPeople(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const allProfiles = yield userModel_1.default.find({}).select('avatar _id name title');
        const rand = Math.floor(Math.random() * (allProfiles.length - 5));
        const recommendedPeople = allProfiles.slice(rand, rand + 3);
        res.send(recommendedPeople);
    });
}
exports.getRandomRecommendedPeople = getRandomRecommendedPeople;
function getTopCommunities(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const topCommunities = yield userModel_1.default.find({ community: true }).select('avatar _id name');
        res.send(topCommunities);
    });
}
exports.getTopCommunities = getTopCommunities;
//put
function followUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        // The user that we are trying to follow
        const userFollowing = yield userModel_1.default.findById({ _id: id });
        const userProfile = yield userModel_1.default.findByIdAndUpdate(req.user, {
            $push: {
                following: {
                    id,
                    name: `${userFollowing.name}`,
                    avatar: `${userFollowing.avatar}`,
                },
            },
        });
        const userToBeFollowed = yield userModel_1.default.findByIdAndUpdate(id, {
            $push: {
                follower: {
                    id: req.user,
                    name: `${userProfile.name}`,
                    avatar: `${userProfile.avatar}`,
                },
            },
        });
        yield userProfile.save();
        yield userToBeFollowed.save();
        res.status(200).send('success');
    });
}
exports.followUser = followUser;
function unfollowUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const userUnfollowing = yield userModel_1.default.findById({ _id: id });
        const userProfile = yield userModel_1.default.findByIdAndUpdate(req.user, {
            $pull: {
                following: {
                    id,
                    name: `${userUnfollowing.name}`,
                },
            },
        });
        const userToBeFollowed = yield userModel_1.default.findByIdAndUpdate(id, {
            $pull: {
                follower: {
                    id: req.user,
                    name: `${userProfile.name}`,
                },
            },
        });
        yield userProfile.save();
        yield userToBeFollowed.save();
        res.status(200).send('success');
    });
}
exports.unfollowUser = unfollowUser;
function updateUserInformation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, title, bio, email, password } = req.body;
        const { id } = req.params;
        const oldPassword = yield userModel_1.default.findById(id);
        const user = yield userModel_1.default.findByIdAndUpdate(id, {
            name,
            title,
            bio,
            email,
            password: password !== '' ? password : oldPassword.password,
        });
        return res.status(200).send(user);
    });
}
exports.updateUserInformation = updateUserInformation;
function addNewIngredientToInventory(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        const { ingredient, quantity, unit, type } = req.body;
        const user = yield userModel_1.default.findById(userId);
        try {
            const inventory = user === null || user === void 0 ? void 0 : user.allInventory.map(inventory => {
                return {
                    quantity: inventory.quantity,
                    unit: inventory.unit,
                    ingredient: inventory.ingredient,
                    type: inventory.type,
                };
            });
            const index = inventory.findIndex((item) => item.ingredient === ingredient);
            if (index !== -1) {
                inventory[index].quantity += parseInt(quantity);
                yield userModel_1.default.findByIdAndUpdate(userId, {
                    $set: {
                        allInventory: inventory,
                    },
                });
            }
            else {
                yield userModel_1.default.findByIdAndUpdate(userId, {
                    $push: {
                        allInventory: { ingredient, quantity, unit, type },
                    },
                });
            }
            return res.status(200).send('successfully added ingredient to inventory');
        }
        catch (error) {
            res.status(401).send(error);
        }
    });
}
exports.addNewIngredientToInventory = addNewIngredientToInventory;
function updateProfilePicture(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id = req.user;
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
        });
        try {
            // @ts-ignore
            let { path } = req.file;
            const result = yield cloudinary_1.v2.uploader.upload(path);
            yield userModel_1.default.findByIdAndUpdate(id, { avatar: result.url });
            return res.json({ url: result.url });
        }
        catch (error) {
            console.error(error);
            return res.json({ url: 'err' });
        }
    });
}
exports.updateProfilePicture = updateProfilePicture;
