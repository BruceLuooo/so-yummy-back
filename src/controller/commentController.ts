import { Request, Response } from 'express';
import Comment from '../models/commentModel';
import RecipeComment from '../models/recipeCommentModel';
import { postNewComment, newRecipeComment } from '../service/commentService';

//get
export async function didUserAlreadyLikeComment(req: Request, res: Response) {
	const { id } = req.params;

	const post = await Comment.findOne({ _id: id, likes: req.user });

	if (post) {
		return res.status(200).json({ status: true });
	} else {
		return res.status(200).json({ status: false });
	}
}
export async function getCommentLikes(req: Request, res: Response) {
	const { id } = req.params;

	const likes = await Comment.findById(id)
		.populate('likes', 'avatar _id name')
		.select('likes');

	return res.status(200).send(likes);
}
export async function getRecipeComments(req: Request, res: Response) {
	const { id } = req.params;
	try {
		const comments = await RecipeComment.find({ recipeId: id })
			.sort({ date: -1 })
			.populate('createdBy', '_id name avatar title');

		return res.status(200).send(comments);
	} catch (error) {
		return res.status(400).send(error);
	}
}

//post
export async function postComment(req: Request, res: Response) {
	const { id } = req.params;
	const { comment } = req.body;

	try {
		const newComment = await postNewComment(comment, req.user!, id);

		const final = {
			...newComment._doc,
			likes: newComment.likes.length,
		};

		return res.status(200).json(final);
	} catch (error) {
		return res.status(401).send(error);
	}
}

export async function recipeComment(req: Request, res: Response) {
	const { comment, rating } = req.body;
	const { recipeId } = req.params;

	try {
		const recipeComment = await newRecipeComment(
			req.user!,
			comment,
			rating,
			recipeId,
		);

		return res.status(200).send(recipeComment);
	} catch (error) {
		return res.status(401).send(error);
	}
}

//put
export async function likeComment(req: Request, res: Response) {
	const { id } = req.params;

	await Comment.findByIdAndUpdate(id, {
		$push: {
			likes: { _id: req.user },
		},
	});

	return res.status(200).send('Liked Comment');
}
export async function unlikeComment(req: Request, res: Response) {
	const { id } = req.params;

	await Comment.findByIdAndUpdate(id, {
		$pull: {
			likes: req.user,
		},
	});
	return res.status(200).send('Unliked Comment');
}
