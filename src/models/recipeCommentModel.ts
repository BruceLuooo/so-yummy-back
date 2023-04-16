import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const recipeCommentSchema = new Schema({
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	recipeId: { type: String },
	comment: { type: String },
	rating: { type: Number },
	date: { type: Date, default: Date.now },
});

const RecipeComment = mongoose.model('RecipeComment', recipeCommentSchema);
export default RecipeComment;
