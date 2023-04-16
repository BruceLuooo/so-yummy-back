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
exports.getSearchResults = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const recipeModel_1 = __importDefault(require("../models/recipeModel"));
function getSearchResults(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { search } = req.query;
        const profiles = yield userModel_1.default.find({
            name: { $regex: '^' + search, $options: 'i' },
        })
            .select('_id name avatar')
            .limit(5);
        const recipes = yield recipeModel_1.default.find({
            recipeName: { $regex: '^' + search, $options: 'i' },
        }).select('_id images recipeName');
        return res.send({ profiles, recipes });
    });
}
exports.getSearchResults = getSearchResults;
