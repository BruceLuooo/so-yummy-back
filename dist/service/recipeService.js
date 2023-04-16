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
exports.checkIfUserHasCorrectIngredients = exports.addNewRecipe = void 0;
const recipeModel_1 = __importDefault(require("../models/recipeModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
function addNewRecipe(request, imageUrls, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { recipeName, description, cook, prep, serve, ingredients, instructions, } = request;
        const profile = yield userModel_1.default.findById(userId).select('_id name ');
        const newRecipe = new recipeModel_1.default({
            createdBy: profile._id,
            recipeName: JSON.parse(recipeName),
            description: JSON.parse(description),
            cookTime: JSON.parse(cook),
            prepTime: JSON.parse(prep),
            servings: JSON.parse(serve),
            ingredients: JSON.parse(ingredients),
            instructions: JSON.parse(instructions),
            images: imageUrls,
        });
        return yield newRecipe.save();
    });
}
exports.addNewRecipe = addNewRecipe;
function checkIfUserHasCorrectIngredients(user, recipe) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInventory = user.allInventory.map(meat => {
            return {
                ingredient: meat.ingredient.toLowerCase(),
                quantity: meat.quantity,
                unit: meat.unit,
            };
        });
        const recipeIngredient = recipe.ingredients.map(ingredient => {
            return {
                ingredient: ingredient.ingredient.toLowerCase(),
                quantity: ingredient.quantity,
                unit: ingredient.unit,
            };
        });
        const missingIngredients = [];
        recipeIngredient.forEach(ingredient => {
            const doesUserHaveIngredient = userInventory.find(item => item.ingredient === ingredient.ingredient);
            if (doesUserHaveIngredient === undefined) {
                return missingIngredients.push(`Missing ${ingredient.quantity}${ingredient.unit} ${ingredient.ingredient}`);
            }
            if (doesUserHaveIngredient.quantity < ingredient.quantity) {
                return missingIngredients.push(`Missing ${ingredient.quantity - doesUserHaveIngredient.quantity}${ingredient.unit} ${ingredient.ingredient}`);
            }
        });
        return missingIngredients;
    });
}
exports.checkIfUserHasCorrectIngredients = checkIfUserHasCorrectIngredients;
