import { Router } from "express";
import { authController } from "../controllers/auth.controllers";

const router = Router();

router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);

router.get("/me", () => {});

router.put("/user-update/:id", () => {});
router.delete("/user-delete/:id", () => {});

export const authRoutes = { router };
