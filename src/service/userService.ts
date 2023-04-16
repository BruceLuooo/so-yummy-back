import User, { UserDocument, UserInput } from '../models/userModel';

export async function createUser(input: UserInput) {
	const { name, password, confirmPassword, email } = input;

	if (password !== confirmPassword) throw new Error('Passwords do not match');

	try {
		const user = await User.create({
			name,
			password,
			email,
		});

		return user.toJSON();
	} catch (error) {
		throw new Error(error);
	}
}

export async function validateEmailAndPassword(
	email: string,
	password: string,
) {
	const user = await User.findOne({ email });

	if (!user) {
		return false;
	}
	if (user.password !== password) {
		return false;
	}

	return user.toJSON();
}

export async function userInformation(id: string) {
	const user = await User.findOne({ _id: id }).select('-password');

	return user!.toJSON();
}

export async function getUserInventoryInOrder(
	user: UserDocument,
	type: string,
) {
	const inventory = user?.allInventory
		.filter(inventory => inventory.type === type)
		.sort((a, b) => {
			let fa = a.ingredient.toLowerCase(),
				fb = b.ingredient.toLowerCase();

			if (fa < fb) {
				return -1;
			}
			if (fa > fb) {
				return 1;
			}
			return 0;
		});

	return inventory;
}
