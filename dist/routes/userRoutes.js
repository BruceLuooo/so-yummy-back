"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const ingredientSchema_1 = require("../schema/ingredientSchema");
const userSchema_1 = require("../schema/userSchema");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
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
router.post('/', (0, validateResource_1.default)(userSchema_1.createUserSchema), userController_1.createUserHandler);
router.post('/userSession', (0, validateResource_1.default)(userSchema_1.createUserSessionSchema), userController_1.createUserSessionHandler);
//get
router.get('/:id', userController_1.getUserInformation);
router.get('/checkFollowStatus/:id', validateToken_1.default, userController_1.checkFollowStatus);
router.get('/:id/followers', userController_1.getFollowers);
router.get('/:id/following', userController_1.getFollowing);
router.get('/:id/getIngredients/:type', userController_1.getIngredients);
router.get(`/recommendedProfiles/homepage`, validateToken_1.default, userController_1.getRecommendedPeople);
router.get(`/recommendedRandomProfiles/homepage`, userController_1.getRandomRecommendedPeople);
router.get(`/topCommunities/homepage`, userController_1.getTopCommunities);
//put
router.put('/follow/:id', validateToken_1.default, userController_1.followUser);
router.put('/unfollow/:id', validateToken_1.default, userController_1.unfollowUser);
router.put('/updateUserInformation/:id', validateToken_1.default, (0, validateResource_1.default)(userSchema_1.updateUserSchema), userController_1.updateUserInformation);
router.put('/add-new-ingredient-to-inventory', validateToken_1.default, (0, validateResource_1.default)(ingredientSchema_1.newIngredientSchema), userController_1.addNewIngredientToInventory);
router.put('/update-profile-picture', validateToken_1.default, upload.single('avatar'), userController_1.updateProfilePicture);
exports.default = router;
