import express, { Express, Request, Response } from 'express';
import { config } from './config/config';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
	res.send('Hello, this is Express + TypeScript');
});

app.listen(config.server.port, () => {
	console.log(`[Server]: I am running at http://localhost:${port}`);
});
