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
	console.log("am I getting user credentials: ", req.body);
	const { email, password } = req.body;
	const user = await authServices.validateUser(email, password);
	if (!user) {
		sendResponse(res, { message: "invalid email or password" }, 401);
		return;
	}
	const { accessToken, refreshToken } = signToken(user);

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	const result = {
		user: user,
		accessToken,
		refreshToken,
	};
	sendResponse(
		res,
		{ message: "user logged in successful", data: result },
		200,
	);
};
export const refreshToken = (req: Request, res: Response) => {
	const refreshToken = req.cookies?.refreshToken;
	if (!refreshToken) {
		sendResponse(res, { message: "refresh token not found", error: true }, 404);
	}
};
export const authController = {
	signupUser,
	loginUser,
};
