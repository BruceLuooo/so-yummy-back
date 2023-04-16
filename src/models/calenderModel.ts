import mongoose from 'mongoose';

export interface CalenderDocument extends mongoose.Document {
	recipeId: string;
	recipeName: string;
	userId: string;
	completed: boolean;
	date: Date;
}

const calenderModel = new mongoose.Schema({
	recipeId: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Recipe',
	},
	recipeName: { type: String },
	userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
	completed: { type: Boolean, default: false },
	date: { type: Date },
});

const Calender = mongoose.model<CalenderDocument>('Calender', calenderModel);

export default Calender;
