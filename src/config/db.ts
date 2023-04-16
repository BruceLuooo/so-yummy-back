import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(`${process.env.MONGO_URI}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`MongoDb Connected: ${conn.connection.host}`);
	} catch (error) {
		console.log(`error: Error connecting to mongoDB`);
		process.exit(1);
	}
};

export default connectDB;
