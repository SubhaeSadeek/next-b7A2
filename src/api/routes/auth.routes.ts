import { Router } from "express";
import { authController } from "../controllers/auth.controllers";

const router = Router();

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
// router.get("/refresh", authController.refreshToken); // It is only to REGENERATE a refresh token and set it into cookies for future regr=enaration of an access token using this.

export const authRoutes = { router };
