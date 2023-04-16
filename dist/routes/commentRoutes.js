"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controller/commentController");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const router = express_1.default.Router();
//get
router.get('/:id/didUserAlreadyLikeComment', validateToken_1.default, commentController_1.didUserAlreadyLikeComment);
router.get('/:id/getCommentLikes', commentController_1.getCommentLikes);
router.get('/:id/get-recipe-comments', commentController_1.getRecipeComments);
//post
router.post('/:id/postComment', validateToken_1.default, commentController_1.postComment);
router.post('/:recipeId/recipeComment', validateToken_1.default, commentController_1.recipeComment);
//put
router.put('/:id/likeComment', validateToken_1.default, commentController_1.likeComment);
router.put('/:id/unlikeComment', validateToken_1.default, commentController_1.unlikeComment);
exports.default = router;
