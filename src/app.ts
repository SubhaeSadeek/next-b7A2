import express, {
	type Application,
	type Request,
	type Response,
} from "express";

import cookieParser from "cookie-parser";
import { authRoutes } from "./api/routes/auth.routes";

import { issuesRoutes } from "./api/routes/issues.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
	res.send("hellow friends!!!");
});
app.use("/api/auth", authRoutes.router);
app.use("/api/issues", issuesRoutes.router);
app.use(globalErrorHandler);
export default app;
