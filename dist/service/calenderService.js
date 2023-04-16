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
exports.removeIngredientsFromInventory = exports.getPastRecipes = exports.getUpcomingRecipes = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
function getUpcomingRecipes(calender) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterCalender = calender
            .filter(recipe => recipe.completed === false)
            .sort((a, b) => {
            let fa = new Date(a.date.toString()), fb = new Date(b.date.toString());
            if (fa > fb) {
                return -1;
            }
            if (fa < fb) {
                return 1;
            }
            return 0;
        });
        return filterCalender;
    });
}
exports.getUpcomingRecipes = getUpcomingRecipes;
function getPastRecipes(calender) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterCalender = calender
            .filter(recipe => recipe.completed === true)
            .sort((a, b) => {
            let fa = new Date(a.date.toString()), fb = new Date(b.date.toString());
            if (fa > fb) {
                return -1;
            }
            if (fa < fb) {
                return 1;
            }
            return 0;
        });
        return filterCalender;
    });
}
exports.getPastRecipes = getPastRecipes;
function removeIngredientsFromInventory(userId, recipeIngredients) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findById(userId);
        const ingredientsFromInventory = user === null || user === void 0 ? void 0 : user.allInventory.map(ingredient => {
            return {
                quantity: ingredient.quantity,
                ingredient: ingredient.ingredient,
                unit: ingredient.unit,
                type: ingredient.type,
            };
        });
        recipeIngredients.forEach((ingredient) => {
            const index = ingredientsFromInventory === null || ingredientsFromInventory === void 0 ? void 0 : ingredientsFromInventory.findIndex(value => value.ingredient === ingredient.ingredient);
            if (index !== undefined) {
                if (ingredientsFromInventory[index].quantity - ingredient.quantity ===
                    0) {
                    return ingredientsFromInventory.splice(index, 1);
                }
                return (ingredientsFromInventory[index].quantity =
                    ingredientsFromInventory[index].quantity - ingredient.quantity);
            }
        });
        yield userModel_1.default.findByIdAndUpdate(userId, {
            $set: {
                allInventory: ingredientsFromInventory,
            },
        });
    });
}
exports.removeIngredientsFromInventory = removeIngredientsFromInventory;
