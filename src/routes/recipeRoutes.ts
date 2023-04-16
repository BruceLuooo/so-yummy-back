import express from 'express';
import {
	createNewRecipe,
	didUserAlreadySave,
	doesUserHaveCorrectIngredients,
	getRandomSuggestedRecipes,
	getRecipes,
	getSingleRecipe,
	getSuggestedRecipes,
	savedRecipesByUser,
	saveRecipe,
	unsaveRecipe,
} from '../controller/recipeController';
import validateResource from '../middleware/validateResource';
import validateToken from '../middleware/validateToken';
import { createRecipeSchema } from '../schema/recipeSchema';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
	destination: function (
		req: any,
		file: any,
		cb: (arg0: null, arg1: string) => void,
	) {
		cb(null, 'uploads/');
	},
	filename: function (
		req: any,
		file: { originalname: string },
		cb: (arg0: null, arg1: string) => void,
	) {
		cb(null, Date.now() + path.extname(file.originalname)); //Appending extension
	},
});

const upload = multer({ storage: storage });

//get
router.get('/:id/recipes', getRecipes);
router.get('/:id/getSingleRecipe', getSingleRecipe);
router.get('/:id/did-user-already-save', validateToken, didUserAlreadySave);
router.get('/:id/saved-recipes-by-user', savedRecipesByUser);
router.get(
	'/:id/doesUserHaveCorrectIngredients',
	validateToken,
	doesUserHaveCorrectIngredients,
);
router.get(`/recommended-recipes/homepage`, validateToken, getSuggestedRecipes);
router.get('/random-recommendedRecipes/homepage', getRandomSuggestedRecipes);

//post
router.post(
	'/createNewRecipe',
	validateToken,
	upload.array('images', 3),
	validateResource(createRecipeSchema),
	createNewRecipe,
);

//put
router.put('/:id/save-recipe', validateToken, saveRecipe);
router.put('/:id/unsave-recipe', validateToken, unsaveRecipe);

export default router;
