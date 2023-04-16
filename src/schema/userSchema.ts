import { object, string } from 'zod';

export const createUserSchema = object({
	body: object({
		name: string({
			required_error: 'Name is required',
		}),
		password: string({
			required_error: 'Password is required',
		}).min(6, 'Password is too short - should be min.6 characters'),
		confirmPassword: string({
			required_error: 'Password confirmation is required',
		}),
		email: string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
	}),
});

export const createUserSessionSchema = object({
	body: object({
		email: string({
			required_error: 'Email is required',
		}).email('Not a valid email'),
		password: string({
			required_error: 'Password is required',
		}),
	}),
});

export const updateUserSchema = object({
	body: object({
		email: string().email('Not a valid email'),
		name: string().min(1, 'Please check your information'),
	}),
});
