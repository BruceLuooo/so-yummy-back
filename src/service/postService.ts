import Post from '../models/postModel';
import User from '../models/userModel';

export async function addNewPostToDatabase(
	userId: Express.User,
	description: string,
	imageUrls: string[],
) {
	const profile = await User.findById(userId).select('_id name ');

	const newPost = new Post({
		authorId: profile!._id,
		description,
		authorName: profile!.name,
		images: imageUrls,
	});

	await newPost.save();

	const getNewPost = await Post.findById(newPost._id).populate('authorId');

	return getNewPost;
}
