import type { Request, Response } from "express";
import { signToken } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import authServices from "../services/auth.services";

const signupUser = async (req: Request, res: Response) => {
	const result = await authServices.createUser(req.body);

	if (!result) {
		return sendResponse(res, { message: " can not create user" }, 500);
	}
	sendResponse(
		res,
		{ message: "user created successfully", data: result },
		201,
	);
};

const loginUser = async (req: Request, res: Response) => {
	const { userEmail, password } = req.body;
	const user = await authServices.validateUser(userEmail, password);
	if (!user) {
		sendResponse(res, { message: "invalid email or password" }, 401);
		return;
	}
	const { accessToken, refreshToken } = signToken(user);
	const result = {
		user: user,
		accessToken,
		refreshToken,
	};
	sendResponse(
		res,
		{ message: "user logged in successful", data: result },
		201,
	);
};

export const authController = {
	signupUser,
	loginUser,
};
