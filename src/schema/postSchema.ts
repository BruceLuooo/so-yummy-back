import { object, string } from 'zod';

export const createPostSchema = object({
	body: object({
		description: string({
			required_error: 'Post cannot be empty',
		}).min(1, 'Post cannot be empty'),
	}),
});
