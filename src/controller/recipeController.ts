import { Request, Response } from 'express';
import User from '../models/userModel';
import Recipe from '../models/recipeModel';
import { v2 as cloudinary } from 'cloudinary';
import {
	addNewRecipe,
	checkIfUserHasCorrectIngredients,
} from '../service/recipeService';

//post
export const createNewRecipe = async (req: Request, res: Response) => {
	cloudinary.config({
		cloud_name: process.env.CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_SECRET,
	});

	try {
		const urls: string[] = [];
		const files = req.files;
		for (const file of files as []) {
			const { path } = file;
			const newPath = await cloudinary.uploader.upload(path);
			urls.push(newPath.url);
		}

		if (urls.length === 0) {
			urls.push(
				'https://res.cloudinary.com/dcugduoiu/image/upload/v1677997924/RecipeDefault_lxxlev.png',
			);
		}

		const newRecipe = await addNewRecipe(req.body, urls, req.user!);

		await User.findByIdAndUpdate(req.user, {
			$push: {
				personalRecipes: {
					_id: newRecipe._id,
				},
			},
		});

		res.status(200).json(urls);
	} catch (error) {
		res.status(401).send(error);
	}
};

//get
export const getRecipes = async (req: Request, res: Response) => {
	const { id } = req.params;

	try {
		const findRecipes = await Recipe.find({
			createdBy: id,
		})
			.populate('createdBy', 'name title avatar')
			.sort({ date: 'desc' })
			.limit(5);

		const recipes = findRecipes.map((recipe: any) => {
			return {
				name: recipe.createdBy.name,
				title: recipe.createdBy.title,
				recipeName: recipe.recipeName,
				recipeId: recipe._id,
				avatar: recipe.createdBy.avatar,
				images: recipe.images,
			};
		});

		res.status(200).send(recipes);
	} catch (error) {
		res.status(401).send('the request is going through at least');
	}
};
export const getMoreRecipes = async (req: Request, res: Response) => {
	const { id } = req.params;
	const { page } = req.query;

	try {
		const findRecipes = await Recipe.find({ createdBy: id })
			.populate('createdBy', 'name title avatar')
			.sort({ date: 'desc' })
			.limit(5)
			.skip((parseInt(page as string) - 1) * 5);

		const recipes = findRecipes.map((recipe: any) => {
			return {
				name: recipe.createdBy.name,
				title: recipe.createdBy.title,
				recipeName: recipe.recipeName,
				recipeId: recipe._id,
				avatar: recipe.createdBy.avatar,
			};
		});

		res.status(200).send(recipes);
	} catch (error) {
		res.status(401).send(error);
	}
};
export const getSingleRecipe = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const findRecipe = await Recipe.findOne({ _id: id }).populate(
			'createdBy',
			'name _id',
		);

		res.status(200).send(findRecipe);
	} catch (error) {
		res.status(401).send(error);
	}
};
export const didUserAlreadySave = async (req: Request, res: Response) => {
	const { id } = req.params;

	const user = await Recipe.findOne({
		_id: id,
		savedBy: req.user,
	}).select('savedRecipes');

	if (!user) {
		res.status(200).send(false);
	} else {
		res.status(200).send(true);
	}
};
export const savedRecipesByUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;

		const findRecipes = await Recipe.find({
			savedBy: { _id: id },
		})
			.populate('createdBy', 'name title avatar')
			.sort({ date: 'desc' })
			.limit(5);

		const recipes = findRecipes.map((recipe: any) => {
			return {
				name: recipe.createdBy.name,
				title: recipe.createdBy.title,
				recipeName: recipe.recipeName,
				recipeId: recipe._id,
				avatar: recipe.createdBy.avatar,
				images: recipe.images,
			};
		});

		return res.status(200).send(recipes);
	} catch (error) {
		res.status(401).send('There was an error trying to find saved recipes');
	}
};
export const doesUserHaveCorrectIngredients = async (
	req: Request,
	res: Response,
) => {
	const userId = req.user;
	const { id } = req.params;

	const user = await User.findById(userId);
	const recipe = await Recipe.findById(id);

	const missingIngredients = await checkIfUserHasCorrectIngredients(
		user!,
		recipe!,
	);

	if (missingIngredients.length === 0) {
		return res.status(200).send(true);
	} else {
		return res.status(200).json(missingIngredients);
	}
};
export const getRandomSuggestedRecipes = async (
	req: Request,
	res: Response,
) => {
	const allRecipes = await Recipe.find({}).select(
		'createdBy recipeName images',
	);
	const rand = Math.floor(Math.random() * (allRecipes.length - 4));

	const recommendedRecipes = allRecipes.slice(rand, rand + 5);

	res.send(recommendedRecipes);
};

export const getSuggestedRecipes = async (req: Request, res: Response) => {
	const allRecipes = await Recipe.find({
		createdBy: { $ne: req.user },
	}).select('createdBy recipeName images');

	const rand = Math.floor(Math.random() * (allRecipes.length - 4));
	const recommendedRecipes = allRecipes.slice(rand, rand + 5);

	res.send(recommendedRecipes);
};

//put
export const saveRecipe = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await Recipe.findByIdAndUpdate(id, {
			$push: {
				savedBy: { _id: req.user },
			},
		});

		res.status(200).send('Recipe saved');
	} catch (error) {
		res.status(401).send('Could not save recipe');
	}
};
export const unsaveRecipe = async (req: Request, res: Response) => {
	const { id } = req.params;
	try {
		await Recipe.findByIdAndUpdate(id, {
			$pull: {
				savedBy: req.user,
			},
		});

		res.status(200).send('Recipe unsaved');
	} catch (error) {
		res.status(401).send('There was an error trying to remove the recipe');
	}
};
