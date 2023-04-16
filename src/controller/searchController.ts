import { Request, Response } from 'express';
import User from '../models/userModel';
import Recipe from '../models/recipeModel';

export async function getSearchResults(req: Request, res: Response) {
	const { search } = req.query;

	const profiles = await User.find({
		name: { $regex: '^' + search, $options: 'i' },
	})
		.select('_id name avatar')
		.limit(5);

	const recipes = await Recipe.find({
		recipeName: { $regex: '^' + search, $options: 'i' },
	}).select('_id images recipeName');

	return res.send({ profiles, recipes });
}
