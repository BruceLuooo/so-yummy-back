import express from 'express';
import { getSearchResults } from '../controller/searchController';

const router = express.Router();

router.get('/', getSearchResults);

export default router;
