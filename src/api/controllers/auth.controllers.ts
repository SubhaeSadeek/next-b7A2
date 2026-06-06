import type { Request, Response } from "express";
import { signToken, varifyToken } from "../../utils/jwt";
import { sendResponse } from "../../utils/sendResponse";
import authServices from "../services/auth.services";

const signupUser = async (req: Request, res: Response) => {
	const result = await authServices.createUser(req.body);

	if (!result) {
		return sendResponse(
			res,
			{ success: false, message: " can not create user" },
			500,
		);
	}
	sendResponse(
		res,
		{ success: true, message: "user created successfully", data: result },
		201,
	);
};

const loginUser = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await authServices.validateUser(email, password);
	if (!user) {
		sendResponse(
			res,
			{ success: false, message: "invalid email or password" },
			401,
		);
		return;
	}
	const { accessToken, refreshToken } = signToken(user);

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	const result = {
		token: accessToken,
		user: user,
	};
	sendResponse(
		res,
		{ success: true, message: "user logged in successful", data: result },
		200,
	);
};

// here we genereate refresh token again after varifying user from refresh token we put in cookies and then varify user by it. after that we generate another access token and update the refesh token. THIS TASK IS OPTIONAL AND EXTRA as the assignement ONLY requires to genereate access token/single token to work with.

const refreshToken = async (req: Request, res: Response) => {
	const refreshToken = req.cookies?.refreshToken;
	if (!refreshToken) {
		sendResponse(
			res,
			{ success: false, message: "refresh token not found" },
			404,
		);
	}
	const payload = varifyToken(refreshToken, "refresh");
	if (!payload) {
		sendResponse(
			res,
			{
				success: false,
				message: "User not varified or refresh token is invalid",
			},
			401,
		);
		return;
	}
	const user = await authServices.getUserById(payload.id);
	if (!user) {
		sendResponse(res, { success: false, message: "User not found" }, 404);
		return;
	}
	const { accessToken, refreshToken: newRefreshToken } = signToken(user);
	res.cookie("refreshToken", newRefreshToken, {
		secure: false,
		sameSite: "lax",
		httpOnly: true,
	});
	sendResponse(res, {
		success: true,
		message: "access tokens has been sent",
		data: {
			token: accessToken,
		},
	});
};
export const authController = {
	signupUser,
	loginUser,
	refreshToken,
};
