import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JwtPayload {
	id?: string;
}

const validateToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization;

	if (!token) {
		return res.status(401).send('No token found, please login first');
	}

	try {
		const decodedToken = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as JwtPayload;
		req.user = decodedToken.id;
		next();
	} catch {
		return res.status(401).send('Invalid Token');
	}
};

export default validateToken;
