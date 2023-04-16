import express from 'express';
import {
	addNewIngredientToInventory,
	checkFollowStatus,
	createUserHandler,
	createUserSessionHandler,
	followUser,
	getFollowers,
	getFollowing,
	getIngredients,
	getRandomRecommendedPeople,
	getRecommendedPeople,
	getTopCommunities,
	getUserInformation,
	unfollowUser,
	updateProfilePicture,
	updateUserInformation,
} from '../controller/userController';
import validateResource from '../middleware/validateResource';
import validateToken from '../middleware/validateToken';
import { newIngredientSchema } from '../schema/ingredientSchema';
import {
	createUserSchema,
	createUserSessionSchema,
	updateUserSchema,
} from '../schema/userSchema';
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

//post
router.post('/', validateResource(createUserSchema), createUserHandler);
router.post(
	'/userSession',
	validateResource(createUserSessionSchema),
	createUserSessionHandler,
);

//get
router.get('/:id', getUserInformation);
router.get('/checkFollowStatus/:id', validateToken, checkFollowStatus);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);
router.get('/:id/getIngredients/:type', getIngredients);
router.get(
	`/recommendedProfiles/homepage`,
	validateToken,
	getRecommendedPeople,
);
router.get(`/recommendedRandomProfiles/homepage`, getRandomRecommendedPeople);
router.get(`/topCommunities/homepage`, getTopCommunities);

//put
router.put('/follow/:id', validateToken, followUser);
router.put('/unfollow/:id', validateToken, unfollowUser);
router.put(
	'/updateUserInformation/:id',
	validateToken,
	validateResource(updateUserSchema),
	updateUserInformation,
);
router.put(
	'/add-new-ingredient-to-inventory',
	validateToken,
	validateResource(newIngredientSchema),
	addNewIngredientToInventory,
);
router.put(
	'/update-profile-picture',
	validateToken,
	upload.single('avatar'),
	updateProfilePicture,
);

export default router;
