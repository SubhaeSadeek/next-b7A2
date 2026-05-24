import dotenv from "dotenv";
import { env } from "node:process";

dotenv.config({ quiet: true });
const config = {
	port: env.PORT,
	database_url: env.DATABASE_URL as string,
	jwt_secret: env.JWT_SECTET as string,
	refresh_secret: env.REFRESH_SECRET as string,
};

export default config;
