import express, {
	type Application,
	type Request,
	type Response,
} from "express";

import cookieParser from "cookie-parser";
import { authRoutes } from "./api/routes/auth.routes";

import { issuesRoutes } from "./api/routes/issues.routes";
import { initDB } from "./db";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
initDB();
app.get("/", (req: Request, res: Response) => {
	res.send("Welcome to DevPlus for posting your Issues!!!");
});
app.use("/api/auth", authRoutes.router);
app.use("/api/issues", issuesRoutes.router);
app.use(globalErrorHandler);
export default app;
