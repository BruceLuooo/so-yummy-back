"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controller/postController");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const postSchema_1 = require("../schema/postSchema");
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path_1.default.extname(file.originalname)); //Appending extension
    },
});
const upload = (0, multer_1.default)({ storage: storage });
//post
router.post('/create', validateToken_1.default, upload.array('images', 3), (0, validateResource_1.default)(postSchema_1.createPostSchema), postController_1.createNewPost);
//get
router.get('/:id', postController_1.getUsersPost);
router.get('/:id/getMoreUsersPost', postController_1.getMoreUsersPost);
router.get('/:id/didUserAlreadyLike', validateToken_1.default, postController_1.didUserAlreadyLike);
router.get('/:id/getPostComments', postController_1.getPostComments);
router.get('/:id/getMorePostComments', postController_1.getMorePostComments);
router.get('/:id/getPostLikes', postController_1.getPostLikes);
router.get('/news-feed/current-user', validateToken_1.default, postController_1.getUsersNewsFeed);
router.get('/get-more-news-feed/current-user', validateToken_1.default, postController_1.getMoreUsersNewsFeed);
router.get('/newsfeed/random', postController_1.getRandomNewsFeed);
router.get('/newsfeed/moreRandom', postController_1.getMoreRandomNewsFeed);
//put
router.put('/:id/likepost', validateToken_1.default, postController_1.likePost);
router.put('/:id/unlikePost', validateToken_1.default, postController_1.unlikePost);
exports.default = router;
