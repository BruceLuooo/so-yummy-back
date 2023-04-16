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
exports.unsaveRecipe = exports.saveRecipe = exports.getSuggestedRecipes = exports.getRandomSuggestedRecipes = exports.doesUserHaveCorrectIngredients = exports.savedRecipesByUser = exports.didUserAlreadySave = exports.getSingleRecipe = exports.getMoreRecipes = exports.getRecipes = exports.createNewRecipe = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const recipeModel_1 = __importDefault(require("../models/recipeModel"));
const cloudinary_1 = require("cloudinary");
const recipeService_1 = require("../service/recipeService");
//post
const createNewRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
    });
    try {
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newPath = yield cloudinary_1.v2.uploader.upload(path);
            urls.push(newPath.url);
        }
        if (urls.length === 0) {
            urls.push('https://res.cloudinary.com/dcugduoiu/image/upload/v1677997924/RecipeDefault_lxxlev.png');
        }
        const newRecipe = yield (0, recipeService_1.addNewRecipe)(req.body, urls, req.user);
        yield userModel_1.default.findByIdAndUpdate(req.user, {
            $push: {
                personalRecipes: {
                    _id: newRecipe._id,
                },
            },
        });
        res.status(200).json(urls);
    }
    catch (error) {
        res.status(401).send(error);
    }
});
exports.createNewRecipe = createNewRecipe;
//get
const getRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const findRecipes = yield recipeModel_1.default.find({
            createdBy: id,
        })
            .populate('createdBy', 'name title avatar')
            .sort({ date: 'desc' })
            .limit(5);
        const recipes = findRecipes.map((recipe) => {
            return {
                name: recipe.createdBy.name,
                title: recipe.createdBy.title,
                recipeName: recipe.recipeName,
                recipeId: recipe._id,
                avatar: recipe.createdBy.avatar,
                images: recipe.images,
            };
        });
        res.status(200).send(recipes);
    }
    catch (error) {
        res.status(401).send('the request is going through at least');
    }
});
exports.getRecipes = getRecipes;
const getMoreRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { page } = req.query;
    try {
        const findRecipes = yield recipeModel_1.default.find({ createdBy: id })
            .populate('createdBy', 'name title avatar')
            .sort({ date: 'desc' })
            .limit(5)
            .skip((parseInt(page) - 1) * 5);
        const recipes = findRecipes.map((recipe) => {
            return {
                name: recipe.createdBy.name,
                title: recipe.createdBy.title,
                recipeName: recipe.recipeName,
                recipeId: recipe._id,
                avatar: recipe.createdBy.avatar,
            };
        });
        res.status(200).send(recipes);
    }
    catch (error) {
        res.status(401).send(error);
    }
});
exports.getMoreRecipes = getMoreRecipes;
const getSingleRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const findRecipe = yield recipeModel_1.default.findOne({ _id: id }).populate('createdBy', 'name _id');
        res.status(200).send(findRecipe);
    }
    catch (error) {
        res.status(401).send(error);
    }
});
exports.getSingleRecipe = getSingleRecipe;
const didUserAlreadySave = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield recipeModel_1.default.findOne({
        _id: id,
        savedBy: req.user,
    }).select('savedRecipes');
    if (!user) {
        res.status(200).send(false);
    }
    else {
        res.status(200).send(true);
    }
});
exports.didUserAlreadySave = didUserAlreadySave;
const savedRecipesByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const findRecipes = yield recipeModel_1.default.find({
            savedBy: { _id: id },
        })
            .populate('createdBy', 'name title avatar')
            .sort({ date: 'desc' })
            .limit(5);
        const recipes = findRecipes.map((recipe) => {
            return {
                name: recipe.createdBy.name,
                title: recipe.createdBy.title,
                recipeName: recipe.recipeName,
                recipeId: recipe._id,
                avatar: recipe.createdBy.avatar,
                images: recipe.images,
            };
        });
        return res.status(200).send(recipes);
    }
    catch (error) {
        res.status(401).send('There was an error trying to find saved recipes');
    }
});
exports.savedRecipesByUser = savedRecipesByUser;
const doesUserHaveCorrectIngredients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user;
    const { id } = req.params;
    const user = yield userModel_1.default.findById(userId);
    const recipe = yield recipeModel_1.default.findById(id);
    const missingIngredients = yield (0, recipeService_1.checkIfUserHasCorrectIngredients)(user, recipe);
    if (missingIngredients.length === 0) {
        return res.status(200).send(true);
    }
    else {
        return res.status(200).json(missingIngredients);
    }
});
exports.doesUserHaveCorrectIngredients = doesUserHaveCorrectIngredients;
const getRandomSuggestedRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allRecipes = yield recipeModel_1.default.find({}).select('createdBy recipeName images');
    const rand = Math.floor(Math.random() * (allRecipes.length - 4));
    const recommendedRecipes = allRecipes.slice(rand, rand + 5);
    res.send(recommendedRecipes);
});
exports.getRandomSuggestedRecipes = getRandomSuggestedRecipes;
const getSuggestedRecipes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allRecipes = yield recipeModel_1.default.find({
        createdBy: { $ne: req.user },
    }).select('createdBy recipeName images');
    const rand = Math.floor(Math.random() * (allRecipes.length - 4));
    const recommendedRecipes = allRecipes.slice(rand, rand + 5);
    res.send(recommendedRecipes);
});
exports.getSuggestedRecipes = getSuggestedRecipes;
//put
const saveRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield recipeModel_1.default.findByIdAndUpdate(id, {
            $push: {
                savedBy: { _id: req.user },
            },
        });
        res.status(200).send('Recipe saved');
    }
    catch (error) {
        res.status(401).send('Could not save recipe');
    }
});
exports.saveRecipe = saveRecipe;
const unsaveRecipe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield recipeModel_1.default.findByIdAndUpdate(id, {
            $pull: {
                savedBy: req.user,
            },
        });
        res.status(200).send('Recipe unsaved');
    }
    catch (error) {
        res.status(401).send('There was an error trying to remove the recipe');
    }
});
exports.unsaveRecipe = unsaveRecipe;
