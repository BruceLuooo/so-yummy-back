"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPostSchema = void 0;
const zod_1 = require("zod");
exports.createPostSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        description: (0, zod_1.string)({
            required_error: 'Post cannot be empty',
        }).min(1, 'Post cannot be empty'),
    }),
});
