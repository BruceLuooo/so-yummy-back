import { Request, Response } from 'express';
import Comment from '../models/commentModel';
import Post from '../models/postModel';
import User from '../models/userModel';
import { v2 as cloudinary } from 'cloudinary';
import { addNewPostToDatabase } from '../service/postService';
import mongoose from 'mongoose';

interface PostInterface {
	_doc: Document;
	comments: Array<string>;
	date: Date;
	_id: string;
	authorId: Object;
	description: string;
	authorNmae: string;
	likes: Array<string>;
}

//post
export async function createNewPost(req: Request, res: Response) {
	cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_SECRET,
	});

	const { description } = req.body;

	const imageUrls: string[] = [];
	const files = req.files;
	for (const file of files as []) {
		const { path } = file;
		const newPath = await cloudinary.uploader.upload(path);
		imageUrls.push(newPath.url);
	}

	const newPost = await addNewPostToDatabase(req.user!, description, imageUrls);

	res.send(newPost);
}

//get
export async function getUsersPost(req: Request, res: Response) {
	const { id } = req.params;
	const query = { authorId: id };

	const findPosts = await Post.find(query)
		.populate('authorId', 'title _id avatar')
		.sort({ date: 'desc' })
		.limit(3);

	const posts = findPosts.map((post: PostInterface) => {
		return {
			...post._doc,
			comments: post.comments.length,
			likes: post.likes.length,
		};
	});

	return res.status(200).json({ posts });
}
export async function getMoreUsersPost(req: Request, res: Response) {
	const { id } = req.params;
	const { page } = req.query;
	const query = { authorId: id };

	const findPosts = await Post.find(query)
		.populate('authorId', 'title _id avatar')
		.sort({ date: 'desc' })
		.skip((parseInt(page as string) - 1) * 3)
		.limit(3);

	const posts = findPosts.map((post: PostInterface) => {
		return {
			...post._doc,
			comments: post.comments.length,
			likes: post.likes.length,
		};
	});

	return res.status(200).json(posts);
}
export async function didUserAlreadyLike(req: Request, res: Response) {
	const { id } = req.params;

	const post = await Post.findOne({
		_id: id,
		likes: req.user,
	}).select('likes');

	if (post) {
		return res.status(200).json({ status: true });
	} else {
		return res.status(200).json({ status: false });
	}
}
export async function getPostComments(req: Request, res: Response) {
	const { id } = req.params;

	const findComments = await Comment.find({ postId: id })
		.populate('author', 'name _id avatar')
		.sort({ date: 'desc' })
		.limit(5);

	const comments = findComments.map((comment: PostInterface) => {
		return {
			...comment._doc,
			likes: comment.likes.length,
		};
	});

	res.status(200).json(comments);
}
export async function getMorePostComments(req: Request, res: Response) {
	const { id } = req.params;
	const { page } = req.query;

	const findComments = await Comment.find({ postId: id })
		.populate('author', 'name _id avatar')
		.sort({ date: 'desc' })
		.limit(5)
		.skip((parseInt(page as string) - 1) * 5);

	const comments = findComments.map((comment: PostInterface) => {
		return {
			...comment._doc,
			likes: comment.likes.length,
		};
	});

	res.status(200).json(comments);
}
export async function getPostLikes(req: Request, res: Response) {
	const { id } = req.params;

	const likes = await Post.findById(id)
		.select('likes -_id')
		.populate('likes', 'avatar _id name');

	return res.status(200).json(likes);
}
export async function getUsersNewsFeed(req: Request, res: Response) {
	const posts = await Post.aggregate([
		{ $addFields: { author: { $toString: '$authorId' } } },
		{
			$lookup: {
				from: 'users',
				localField: 'author',
				foreignField: 'following.id',
				as: 'relationship',
			},
		},
		{
			$match: {
				'relationship._id': mongoose.Types.ObjectId(req.user! as string),
			},
		},
	])
		.sort({ date: 'desc' })
		.limit(5);

	await Post.populate(posts, { path: 'authorId', select: 'title _id avatar' });

	const results = posts.map((post: PostInterface) => {
		return {
			...post,
			comments: post.comments.length,
			likes: post.likes.length,
		};
	});

	res.send(results);
}
export async function getMoreUsersNewsFeed(req: Request, res: Response) {
	const { page } = req.query;
	const posts = await Post.aggregate([
		{ $addFields: { author: { $toString: '$authorId' } } },
		{
			$lookup: {
				from: 'users',
				localField: 'author',
				foreignField: 'following.id',
				as: 'relationship',
			},
		},
		{
			$match: {
				'relationship._id': mongoose.Types.ObjectId(req.user! as string),
			},
		},
	])
		.sort({ date: 'desc' })
		.skip((parseInt(page as string) - 1) * 5)
		.limit(5);

	await Post.populate(posts, { path: 'authorId', select: 'title _id avatar' });

	const results = posts.map((post: PostInterface) => {
		return {
			...post,
			comments: post.comments.length,
			likes: post.likes.length,
		};
	});

	res.send(results);
}

export async function getRandomNewsFeed(req: Request, res: Response) {
	const findPosts = await Post.find({})
		.populate('authorId', 'title _id avatar')
		.sort({ likes: -1 })
		.limit(5);

	const posts = findPosts.map((post: PostInterface) => {
		return {
			...post._doc,
			comments: post.comments.length,
			likes: post.likes.length,
		};
	});

	res.send(posts);
}
export async function getMoreRandomNewsFeed(req: Request, res: Response) {
	const { page } = req.query;

	const findPosts = await Post.find({})
		.populate('authorId', 'title _id avatar')
		.sort({ likes: -1 })
		.skip((parseInt(page as string) - 1) * 5)
		.limit(5);

	const posts = findPosts.map((post: PostInterface) => {
		return {
			...post._doc,
			comments: post.comments.length,
			likes: post.likes.length,
		};
	});

	res.send(posts);
}

//put
export async function likePost(req: Request, res: Response) {
	const { id } = req.params;

	await Post.findByIdAndUpdate(id, {
		$push: {
			likes: req.user,
		},
	});

	await User.findByIdAndUpdate(req.user, {
		$push: {
			likedPosts: { _id: id },
		},
	});
	res.status(200).send('user liked');
}
export async function unlikePost(req: Request, res: Response) {
	const { id } = req.params;

	await Post.findByIdAndUpdate(id, {
		$pull: {
			likes: req.user,
		},
	});

	await User.findByIdAndUpdate(req.user, {
		$pull: {
			likedPosts: { _id: id },
		},
	});

	res.status(200).send('user unliked');
}
