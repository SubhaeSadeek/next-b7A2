import { Router, type Request, type Response } from "express";
import { auth } from "../../middleware/auth";
import { authController } from "../controllers/auth.controllers";

const router = Router();

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/refresh", authController.refreshToken);

router.get("/me", auth, (req: Request, res: Response) => {
	res.send("now we match with jwt token in MIDDLE WARE");
});

router.put("/user-update/:id", () => {});
router.delete("/user-delete/:id", () => {});

export const authRoutes = { router };
