"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRecipeSchema = void 0;
const zod_1 = require("zod");
exports.createRecipeSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        recipeName: (0, zod_1.string)({
            required_error: 'Recipe name is required',
        }).min(3, 'Recipe name is required'),
        description: (0, zod_1.string)({
            required_error: 'Description is required',
        }).min(3, 'Description is required'),
        prep: (0, zod_1.string)({
            required_error: 'Prep time is required',
        }).min(3, 'Prep time is required'),
        cook: (0, zod_1.string)({
            required_error: 'Cook time is required',
        }).min(3, 'Cook time is required'),
        serve: (0, zod_1.string)({
            required_error: 'Servings is required',
        }).min(3, 'Servings is required'),
    }),
});
