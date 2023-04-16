import { CalenderDocument } from '../models/calenderModel';
import User from '../models/userModel';

interface Ingredient {
	ingredient: string;
	quantity: number;
	unit?: string;
}

export async function getUpcomingRecipes(calender: CalenderDocument[]) {
	const filterCalender = calender
		.filter(recipe => recipe.completed === false)
		.sort((a, b) => {
			let fa = new Date(a.date.toString()),
				fb = new Date(b.date.toString());

			if (fa > fb) {
				return -1;
			}
			if (fa < fb) {
				return 1;
			}
			return 0;
		});

	return filterCalender;
}

export async function getPastRecipes(calender: CalenderDocument[]) {
	const filterCalender = calender
		.filter(recipe => recipe.completed === true)
		.sort((a, b) => {
			let fa = new Date(a.date.toString()),
				fb = new Date(b.date.toString());

			if (fa > fb) {
				return -1;
			}
			if (fa < fb) {
				return 1;
			}
			return 0;
		});

	return filterCalender;
}

export async function removeIngredientsFromInventory(
	userId: Express.User,
	recipeIngredients: Ingredient[],
) {
	const user = await User.findById(userId);

	const ingredientsFromInventory = user?.allInventory.map(ingredient => {
		return {
			quantity: ingredient.quantity,
			ingredient: ingredient.ingredient,
			unit: ingredient.unit,
			type: ingredient.type,
		};
	});

	recipeIngredients.forEach((ingredient: Ingredient) => {
		const index = ingredientsFromInventory?.findIndex(
			value => value.ingredient === ingredient.ingredient,
		);

		if (index !== undefined) {
			if (
				ingredientsFromInventory![index].quantity - ingredient.quantity ===
				0
			) {
				return ingredientsFromInventory!.splice(index, 1);
			}
			return (ingredientsFromInventory![index].quantity =
				ingredientsFromInventory![index].quantity - ingredient.quantity);
		}
	});
	await User.findByIdAndUpdate(userId, {
		$set: {
			allInventory: ingredientsFromInventory,
		},
	});
}
