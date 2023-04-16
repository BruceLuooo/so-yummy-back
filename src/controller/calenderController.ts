import { Request, Response } from 'express';
import Calender from '../models/calenderModel';
import {
	getPastRecipes,
	getUpcomingRecipes,
	removeIngredientsFromInventory,
} from '../service/calenderService';

export async function getRecipeCalender(req: Request, res: Response) {
	const userId = req.user;
	const { filter } = req.params;

	const calender = await Calender.find({ userId: userId });

	try {
		if (filter === 'upcoming') {
			const recipeCalender = await getUpcomingRecipes(calender);
			res.status(200).send(recipeCalender);
		} else {
			const recipeCalender = await getPastRecipes(calender);
			res.status(200).send(recipeCalender);
		}
	} catch (error) {
		res.status(401).send(error);
	}
}

export async function addRecipeToCalender(req: Request, res: Response) {
	const { recipeId, date, recipeInformation } = req.body;

	try {
		await removeIngredientsFromInventory(
			req.user!,
			recipeInformation.ingredients,
		);

		const newCalenderDate = new Calender({
			recipeId,
			recipeName: recipeInformation.recipeName,
			userId: req.user,
			date,
		});

		await newCalenderDate.save();

		res.status(200).send('Recipe added to calender');
	} catch (error) {
		res.status(401).send(error);
	}
}
