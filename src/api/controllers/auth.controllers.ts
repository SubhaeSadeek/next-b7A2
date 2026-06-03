import type { Request, Response } from "express";
import { signToken, varifyToken } from "../../utils/jwt";
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
const refreshToken = async (req: Request, res: Response) => {
	const refreshToken = req.cookies?.refreshToken;
	if (!refreshToken) {
		sendResponse(res, { message: "refresh token not found", error: true }, 404);
	}
	const payload = varifyToken(refreshToken, "refresh");
	if (!payload) {
		sendResponse(res, { message: "refresh token is invalid" }, 401);
	}
	const user = await authServices.getUserById(payload.id);
	if (!user) {
		sendResponse(res, { message: "User not found" }, 404);
	}
	const { accessToken, refreshToken: newRefreshToken } = signToken(user);
	res.cookie("refreshToken", newRefreshToken, {
		secure: false,
		sameSite: "lax",
		httpOnly: true,
	});
	sendResponse(res, {
		message: "tokens are sent",
		data: {
			accessToken,
			refreshToken,
		},
	});
};
export const authController = {
	signupUser,
	loginUser,
	refreshToken,
};
