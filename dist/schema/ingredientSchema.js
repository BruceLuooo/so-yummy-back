"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newIngredientSchema = void 0;
const zod_1 = require("zod");
exports.newIngredientSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        ingredient: (0, zod_1.string)({
            required_error: 'Recipe name is required',
        }).min(1, 'Recipe name is required'),
        type: (0, zod_1.string)({
            required_error: 'Recipe type is required',
        }).min(1, 'Recipe type is required'),
        quantity: (0, zod_1.string)({
            required_error: 'Please enter a valid quantity',
        }).min(1, 'Please enter a valid quantity'),
    }),
});
