import express from 'express';
import {
	addRecipeToCalender,
	getRecipeCalender,
} from '../controller/calenderController';
import validateToken from '../middleware/validateToken';

const router = express.Router();

router.get('/get-recipe-calender/:filter', validateToken, getRecipeCalender);

router.put('/add-recipe-to-calender', validateToken, addRecipeToCalender);

export default router;
