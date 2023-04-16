import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8000;

export const config = {
	server: {
		port: PORT,
	},
};
