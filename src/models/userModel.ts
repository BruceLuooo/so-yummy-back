import mongoose, { Date, Schema } from 'mongoose';

export interface UserInput {
	email: string;
	name: string;
	password: string;
	confirmPassword: string;
}

export interface Ingredients {
	ingredient: string;
	unit: string;
	quantity: number;
	type: string;
}

export interface UserDocument extends UserInput, mongoose.Document {
	title: string;
	bio: string;
	follower: follow[];
	following: follow[];
	personalRecipes: string[];
	savedRecipes: string[];
	likedPosts: string[];
	community: boolean;
	avatar: string;
	allInventory: Ingredients[];
}

export interface follow {
	id: string;
	name: string;
	avatar: string;
}

const userSchema = new Schema({
	name: { type: String },
	email: { type: String, unique: true },
	password: { type: String },
	title: { type: String, default: '' },
	bio: { type: String, default: '' },
	follower: { type: Array, default: [] },
	following: { type: Array, default: [] },
	personalRecipes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Recipe' }],
	likedPosts: { type: Array, default: [] },
	community: { type: Boolean, default: false },
	avatar: {
		type: String,
		default:
			'https://cdn.discordapp.com/attachments/1007742096104497163/1013499279681277952/unknown.png',
	},
	allInventory: [
		{
			ingredient: { type: String, required: true },
			unit: { type: String },
			quantity: { type: Number, required: true },
			type: { type: String, required: true },
		},
	],
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
