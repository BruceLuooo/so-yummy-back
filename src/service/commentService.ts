import User from '../models/userModel';
import Comment from '../models/commentModel';
import Post from '../models/postModel';
import RecipeComment from '../models/recipeCommentModel';

export async function postNewComment(
	comment: string,
	userId: Express.User,
	postId: string,
) {
	const user = await User.findById(userId).select('name');

	const newComment = new Comment({
		comment,
		postId,
		author: user?._id,
	});

	await newComment.save();

	await Post.findByIdAndUpdate(postId, {
		$push: {
			comments: { _id: newComment._id },
		},
	});

	// I need to return comments populated but I couldn't do it with newComment
	// variable so I had to create and return getNewComments
	const getNewComment = await Comment.findById(newComment._id).populate(
		'author',
		'_id name avatar',
	);

	return getNewComment;
}

export async function newRecipeComment(
	user: Express.User,
	comment: string,
	rating: number,
	id: string,
) {
	const recipeComment = new RecipeComment({
		createdBy: user,
		comment,
		recipeId: id,
		rating,
	});

	await recipeComment.save();

	const getNewComment = await RecipeComment.findById(
		recipeComment._id,
	).populate('createdBy', '_id name avatar title');

	return getNewComment;
}
