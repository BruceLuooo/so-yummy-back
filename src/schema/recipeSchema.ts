import { array, object, string } from 'zod';

export const createRecipeSchema = object({
	body: object({
		recipeName: string({
			required_error: 'Recipe name is required',
		}).min(3, 'Recipe name is required'),
		description: string({
			required_error: 'Description is required',
		}).min(3, 'Description is required'),
		prep: string({
			required_error: 'Prep time is required',
		}).min(3, 'Prep time is required'),
		cook: string({
			required_error: 'Cook time is required',
		}).min(3, 'Cook time is required'),
		serve: string({
			required_error: 'Servings is required',
		}).min(3, 'Servings is required'),
	}),
});
