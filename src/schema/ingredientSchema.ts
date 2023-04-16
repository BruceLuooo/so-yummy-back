import { object, string } from 'zod';

export const newIngredientSchema = object({
	body: object({
		ingredient: string({
			required_error: 'Recipe name is required',
		}).min(1, 'Recipe name is required'),
		type: string({
			required_error: 'Recipe type is required',
		}).min(1, 'Recipe type is required'),
		quantity: string({
			required_error: 'Please enter a valid quantity',
		}).min(1, 'Please enter a valid quantity'),
	}),
});
