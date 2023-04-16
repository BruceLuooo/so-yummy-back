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
exports.getUserInventoryInOrder = exports.userInformation = exports.validateEmailAndPassword = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, password, confirmPassword, email } = input;
        if (password !== confirmPassword)
            throw new Error('Passwords do not match');
        try {
            const user = yield userModel_1.default.create({
                name,
                password,
                email,
            });
            return user.toJSON();
        }
        catch (error) {
            throw new Error(error);
        }
    });
}
exports.createUser = createUser;
function validateEmailAndPassword(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return false;
        }
        if (user.password !== password) {
            return false;
        }
        return user.toJSON();
    });
}
exports.validateEmailAndPassword = validateEmailAndPassword;
function userInformation(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ _id: id }).select('-password');
        return user.toJSON();
    });
}
exports.userInformation = userInformation;
function getUserInventoryInOrder(user, type) {
    return __awaiter(this, void 0, void 0, function* () {
        const inventory = user === null || user === void 0 ? void 0 : user.allInventory.filter(inventory => inventory.type === type).sort((a, b) => {
            let fa = a.ingredient.toLowerCase(), fb = b.ingredient.toLowerCase();
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
        });
        return inventory;
    });
}
exports.getUserInventoryInOrder = getUserInventoryInOrder;
