"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recipeController_1 = require("../controller/recipeController");
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const recipeSchema_1 = require("../schema/recipeSchema");
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
//get
router.get('/:id/recipes', recipeController_1.getRecipes);
router.get('/:id/getSingleRecipe', recipeController_1.getSingleRecipe);
router.get('/:id/did-user-already-save', validateToken_1.default, recipeController_1.didUserAlreadySave);
router.get('/:id/saved-recipes-by-user', recipeController_1.savedRecipesByUser);
router.get('/:id/doesUserHaveCorrectIngredients', validateToken_1.default, recipeController_1.doesUserHaveCorrectIngredients);
router.get(`/recommended-recipes/homepage`, validateToken_1.default, recipeController_1.getSuggestedRecipes);
router.get('/random-recommendedRecipes/homepage', recipeController_1.getRandomSuggestedRecipes);
//post
router.post('/createNewRecipe', validateToken_1.default, upload.array('images', 3), (0, validateResource_1.default)(recipeSchema_1.createRecipeSchema), recipeController_1.createNewRecipe);
//put
router.put('/:id/save-recipe', validateToken_1.default, recipeController_1.saveRecipe);
router.put('/:id/unsave-recipe', validateToken_1.default, recipeController_1.unsaveRecipe);
exports.default = router;
