import Recipe, { RecipeDocument, RecipeInput } from '../models/recipeModel';
import User, { UserDocument } from '../models/userModel';

export async function addNewRecipe(
	request: RecipeInput,
	imageUrls: string[],
	userId: Express.User,
) {
	const {
		recipeName,
		description,
		cook,
		prep,
		serve,
		ingredients,
		instructions,
	} = request;

	const profile = await User.findById(userId).select('_id name ');

	const newRecipe = new Recipe({
		createdBy: profile!._id,
		recipeName: JSON.parse(recipeName),
		description: JSON.parse(description),
		cookTime: JSON.parse(cook),
		prepTime: JSON.parse(prep),
		servings: JSON.parse(serve),
		ingredients: JSON.parse(ingredients),
		instructions: JSON.parse(instructions),
		images: imageUrls,
	});

	return await newRecipe.save();
}

export async function checkIfUserHasCorrectIngredients(
	user: UserDocument,
	recipe: RecipeDocument,
) {
	const userInventory = user.allInventory.map(meat => {
		return {
			ingredient: meat.ingredient.toLowerCase(),
			quantity: meat.quantity,
			unit: meat.unit,
		};
	});

	const recipeIngredient = recipe.ingredients.map(ingredient => {
		return {
			ingredient: ingredient.ingredient.toLowerCase(),
			quantity: ingredient.quantity,
			unit: ingredient.unit,
		};
	});

	const missingIngredients: string[] = [];

	recipeIngredient.forEach(ingredient => {
		const doesUserHaveIngredient = userInventory.find(
			item => item.ingredient === ingredient.ingredient,
		);

		if (doesUserHaveIngredient === undefined) {
			return missingIngredients.push(
				`Missing ${ingredient.quantity}${ingredient.unit} ${ingredient.ingredient}`,
			);
		}

		if (doesUserHaveIngredient.quantity < ingredient.quantity) {
			return missingIngredients.push(
				`Missing ${ingredient.quantity - doesUserHaveIngredient.quantity}${
					ingredient.unit
				} ${ingredient.ingredient}`,
			);
		}
	});

	return missingIngredients;
}
