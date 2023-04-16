"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSessionSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: 'Name is required',
        }),
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        }).min(6, 'Password is too short - should be min.6 characters'),
        confirmPassword: (0, zod_1.string)({
            required_error: 'Password confirmation is required',
        }),
        email: (0, zod_1.string)({
            required_error: 'Email is required',
        }).email('Not a valid email'),
    }),
});
exports.createUserSessionSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'Email is required',
        }).email('Not a valid email'),
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        }),
    }),
});
exports.updateUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)().email('Not a valid email'),
        name: (0, zod_1.string)().min(1, 'Please check your information'),
    }),
});
