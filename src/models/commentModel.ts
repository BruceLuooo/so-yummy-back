import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
	author: string;
	comment: string;
	postId: string;
	likes: string[];
	date: Date;
}

const commentModel = new mongoose.Schema({
	author: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	comment: {
		type: String,
		required: true,
	},
	postId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Post',
		required: true,
	},
	likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
	date: {
		type: Date,
		default: Date.now,
	},
});

const Comment = mongoose.model('Comment', commentModel);

export default Comment;
