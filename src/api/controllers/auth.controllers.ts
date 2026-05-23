import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import authServices from "../services/auth.services";

const signupUser = async (req: Request, res: Response) => {
	console.log(req.body);
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

export const authController = {
	signupUser,
};
