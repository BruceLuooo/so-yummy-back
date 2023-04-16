import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
	description: { type: String, required: true },
	authorId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
	authorName: { type: String, required: true },
	likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
	comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Comment' }],
	date: {
		type: Date,
		default: Date.now,
	},
	images: { type: Array, default: [] },
});

const Post = mongoose.model('Post', postSchema);

export default Post;
