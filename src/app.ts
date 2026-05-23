import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import { authRoutes } from "./api/routes/auth.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandler";

const app: Application = express();
app.use(express.json());
// app.use(logger);

app.get("/", (req: Request, res: Response) => {
	res.send("hellow friends!!!");
});
app.use("/api/v1/auth", authRoutes.router);
app.use(globalErrorHandler);
export default app;
