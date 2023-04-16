import mongoose from 'mongoose';
const Schema = mongoose.Schema;

export interface RecipeDocument extends mongoose.Document {
	createdBy: string;
	recipeName: string;
	description: string;
	cookTime: number;
	prepTime: number;
	servings: number;
	ingredients: {
		id: number;
		ingredient: string;
		type: string;
		quantity: number;
		unit: string;
	}[];
	instructions: {
		id: string;
		instruction: string;
	}[];
	date: Date;
	savedBy: string[];
	images: string[];
}

export interface RecipeInput {
	recipeName: string;
	description: string;
	cook: string;
	prep: string;
	serve: string;
	ingredients: string;
	instructions: string;
}

const recipeSchema = new Schema({
	createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
	recipeName: { type: String },
	description: { type: String },
	cookTime: { type: Number },
	prepTime: { type: Number },
	servings: { type: Number },
	ingredients: [
		{
			id: { type: Number },
			ingredient: { type: String },
			type: { type: String },
			quantity: { type: Number },
			unit: { type: String },
		},
	],
	instructions: [
		{
			id: { type: String },
			instruction: { type: String },
		},
	],
	date: { type: Date, default: Date.now },
	savedBy: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Recipe' }],
	images: { type: Array, default: [] },
});

const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema);
export default Recipe;
