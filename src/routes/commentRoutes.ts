import express from 'express';
import {
	didUserAlreadyLikeComment,
	getCommentLikes,
	getRecipeComments,
	likeComment,
	postComment,
	recipeComment,
	unlikeComment,
} from '../controller/commentController';
import validateToken from '../middleware/validateToken';

const router = express.Router();

//get
router.get(
	'/:id/didUserAlreadyLikeComment',
	validateToken,
	didUserAlreadyLikeComment,
);

router.get('/:id/getCommentLikes', getCommentLikes);
router.get('/:id/get-recipe-comments', getRecipeComments);

//post
router.post('/:id/postComment', validateToken, postComment);
router.post('/:recipeId/recipeComment', validateToken, recipeComment);

//put
router.put('/:id/likeComment', validateToken, likeComment);
router.put('/:id/unlikeComment', validateToken, unlikeComment);

export default router;
