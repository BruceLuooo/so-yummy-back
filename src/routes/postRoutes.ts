import express from 'express';
import {
	createNewPost,
	didUserAlreadyLike,
	getUsersPost,
	getMorePostComments,
	getPostComments,
	getPostLikes,
	likePost,
	unlikePost,
	getMoreUsersPost,
	getUsersNewsFeed,
	getMoreUsersNewsFeed,
	getRandomNewsFeed,
	getMoreRandomNewsFeed,
} from '../controller/postController';
import validateToken from '../middleware/validateToken';
import multer from 'multer';
import path from 'path';
import validateResource from '../middleware/validateResource';
import { createPostSchema } from '../schema/postSchema';

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
router.post(
	'/create',
	validateToken,
	upload.array('images', 3),
	validateResource(createPostSchema),
	createNewPost,
);

//get
router.get('/:id', getUsersPost);
router.get('/:id/getMoreUsersPost', getMoreUsersPost);
router.get('/:id/didUserAlreadyLike', validateToken, didUserAlreadyLike);
router.get('/:id/getPostComments', getPostComments);
router.get('/:id/getMorePostComments', getMorePostComments);
router.get('/:id/getPostLikes', getPostLikes);
router.get('/news-feed/current-user', validateToken, getUsersNewsFeed);
router.get(
	'/get-more-news-feed/current-user',
	validateToken,
	getMoreUsersNewsFeed,
);
router.get('/newsfeed/random', getRandomNewsFeed);
router.get('/newsfeed/moreRandom', getMoreRandomNewsFeed);

//put
router.put('/:id/likepost', validateToken, likePost);
router.put('/:id/unlikePost', validateToken, unlikePost);

export default router;
