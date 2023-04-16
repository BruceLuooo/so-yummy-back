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
exports.addRecipeToCalender = exports.getRecipeCalender = void 0;
const calenderModel_1 = __importDefault(require("../models/calenderModel"));
const calenderService_1 = require("../service/calenderService");
function getRecipeCalender(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.user;
        const { filter } = req.params;
        const calender = yield calenderModel_1.default.find({ userId: userId });
        try {
            if (filter === 'upcoming') {
                const recipeCalender = yield (0, calenderService_1.getUpcomingRecipes)(calender);
                res.status(200).send(recipeCalender);
            }
            else {
                const recipeCalender = yield (0, calenderService_1.getPastRecipes)(calender);
                res.status(200).send(recipeCalender);
            }
        }
        catch (error) {
            res.status(401).send(error);
        }
    });
}
exports.getRecipeCalender = getRecipeCalender;
function addRecipeToCalender(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { recipeId, date, recipeInformation } = req.body;
        try {
            yield (0, calenderService_1.removeIngredientsFromInventory)(req.user, recipeInformation.ingredients);
            const newCalenderDate = new calenderModel_1.default({
                recipeId,
                recipeName: recipeInformation.recipeName,
                userId: req.user,
                date,
            });
            yield newCalenderDate.save();
            res.status(200).send('Recipe added to calender');
        }
        catch (error) {
            res.status(401).send(error);
        }
    });
}
exports.addRecipeToCalender = addRecipeToCalender;
