import { Request, Response } from 'express';
import {
	createUser,
	getUserInventoryInOrder,
	userInformation,
	validateEmailAndPassword,
} from '../service/userService';
import { generateToken } from '../helper/jwt';
import { v2 as cloudinary } from 'cloudinary';
import User from '../models/userModel';
import mongoose from 'mongoose';

interface Ingredient {
	ingredient: string;
	quantity: number;
	unit?: string;
}

// post
export async function createUserHandler(req: Request, res: Response) {
	try {
		const user = await createUser(req.body);

		const sessionToken = generateToken(user._id);

		return res.status(200).json({ userId: user._id, token: sessionToken });
	} catch (error) {
		return res.status(409).send(error.message);
	}
}

export async function createUserSessionHandler(req: Request, res: Response) {
	const { email, password } = req.body;

	const user = await validateEmailAndPassword(email, password);

	if (!user) {
		return res.status(401).send('Invalid Email or Password');
	}

	const sessionToken = generateToken(user._id);

	return res.status(200).json({ token: sessionToken, userId: user._id });
}

//get
export async function getUserInformation(req: Request, res: Response) {
	const { id } = req.params;
	const user = await userInformation(id);

	return res.status(200).json(user);
}
export async function checkFollowStatus(req: Request, res: Response) {
	const { id } = req.params;

	const user = await User.findOne({
		_id: req.user,
		'following.id': id,
	}).select('id');

	if (user) {
		return res.status(200).json({ status: true });
	} else {
		return res.status(200).json({ status: false });
	}
}
export async function getFollowers(req: Request, res: Response) {
	const { id } = req.params;

	const followers = await User.findOne({ _id: id }).select('follower');
	res.status(200).json(followers);
}
export async function getFollowing(req: Request, res: Response) {
	const { id } = req.params;

	const following = await User.findOne({ _id: id }).select('following');
	res.status(200).json(following);
}
export async function getIngredients(req: Request, res: Response) {
	const { id, type } = req.params;

	const user = await User.findById(id);

	const inventory = await getUserInventoryInOrder(user!, type);

	if (inventory!.length === 0) {
		res.status(200).send([]);
	} else {
		res.status(200).send(inventory);
	}
}
export async function getRecommendedPeople(req: Request, res: Response) {
	const user = await User.findById(req.user);

	const following = user?.following.map(following => following.id);
	following?.push(req.user as string);

	const recommended = await User.find({
		_id: { $nin: following },
	}).select('avatar _id name title');

	const rand = Math.floor(Math.random() * (recommended.length - 4));
	const recommendedPeople = recommended.slice(rand, rand + 3);

	res.send(recommendedPeople);
}
export async function getRandomRecommendedPeople(req: Request, res: Response) {
	const allProfiles = await User.find({}).select('avatar _id name title');
	const rand = Math.floor(Math.random() * (allProfiles.length - 5));

	const recommendedPeople = allProfiles.slice(rand, rand + 3);

	res.send(recommendedPeople);
}
export async function getTopCommunities(req: Request, res: Response) {
	const topCommunities = await User.find({ community: true }).select(
		'avatar _id name',
	);

	res.send(topCommunities);
}

//put
export async function followUser(req: Request, res: Response) {
	const { id } = req.params;

	// The user that we are trying to follow
	const userFollowing = await User.findById({ _id: id });

	const userProfile = await User.findByIdAndUpdate(req.user, {
		$push: {
			following: {
				id,
				name: `${userFollowing!.name}`,
				avatar: `${userFollowing!.avatar}`,
			},
		},
	});

	const userToBeFollowed = await User.findByIdAndUpdate(id, {
		$push: {
			follower: {
				id: req.user,
				name: `${userProfile!.name}`,
				avatar: `${userProfile!.avatar}`,
			},
		},
	});

	await userProfile!.save();
	await userToBeFollowed!.save();

	res.status(200).send('success');
}
export async function unfollowUser(req: Request, res: Response) {
	const { id } = req.params;

	const userUnfollowing = await User.findById({ _id: id });

	const userProfile = await User.findByIdAndUpdate(req.user, {
		$pull: {
			following: {
				id,
				name: `${userUnfollowing!.name}`,
			},
		},
	});

	const userToBeFollowed = await User.findByIdAndUpdate(id, {
		$pull: {
			follower: {
				id: req.user,
				name: `${userProfile!.name}`,
			},
		},
	});

	await userProfile!.save();
	await userToBeFollowed!.save();

	res.status(200).send('success');
}
export async function updateUserInformation(req: Request, res: Response) {
	const { name, title, bio, email, password } = req.body;
	const { id } = req.params;

	const oldPassword = await User.findById(id);

	const user = await User.findByIdAndUpdate(id, {
		name,
		title,
		bio,
		email,
		password: password !== '' ? password : oldPassword!.password,
	});

	return res.status(200).send(user);
}
export async function addNewIngredientToInventory(req: Request, res: Response) {
	const userId = req.user;
	const { ingredient, quantity, unit, type } = req.body;

	const user = await User.findById(userId);

	try {
		const inventory = user?.allInventory.map(inventory => {
			return {
				quantity: inventory.quantity,
				unit: inventory.unit,
				ingredient: inventory.ingredient,
				type: inventory.type,
			};
		});

		const index = inventory!.findIndex(
			(item: Ingredient) => item.ingredient === ingredient,
		);

		if (index !== -1) {
			inventory![index].quantity += parseInt(quantity);
			await User.findByIdAndUpdate(userId, {
				$set: {
					allInventory: inventory,
				},
			});
		} else {
			await User.findByIdAndUpdate(userId, {
				$push: {
					allInventory: { ingredient, quantity, unit, type },
				},
			});
		}
		return res.status(200).send('successfully added ingredient to inventory');
	} catch (error) {
		res.status(401).send(error);
	}
}
export async function updateProfilePicture(req: Request, res: Response) {
	const id = req.user;

	cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_SECRET,
	});

	try {
		// @ts-ignore
		let { path } = req.file;
		const result = await cloudinary.uploader.upload(path);
		await User.findByIdAndUpdate(id, { avatar: result.url });
		return res.json({ url: result.url });
	} catch (error) {
		console.error(error);
		return res.json({ url: 'err' });
	}
}
