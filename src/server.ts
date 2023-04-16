import express, { Express, Request, Response } from 'express';
import { config } from './config/config';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import commentRoutes from './routes/commentRoutes';
import recipeRoutes from './routes/recipeRoutes';
import calenderRoutes from './routes/calenderRoutes';
import searchRoutes from './routes/searchRoutes';
import cron from 'node-cron';
import Calender from './models/calenderModel';

const app: Express = express();
connectDB();
const port = 8000;

cron.schedule('50 23 * * *', async () => {
	const date = new Date();
	await Calender.updateMany(
		{ completed: false, date: { $lt: date } },
		{
			$set: {
				completed: true,
			},
		},
	);
});

app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
	res.send('Hello, this is Express + TypeScript');
});
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/calenders', calenderRoutes);
app.use('/api/search', searchRoutes);

app.listen(config.server.port, () => {
	console.log(`[Server]: I am running at http://localhost:${port}`);
});
