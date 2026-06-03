import type { NextFunction, Request, Response } from "express";
import authServices from "../api/services/auth.services";
import { varifyToken } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) {
		return sendResponse(res, { message: "token not found" }, 401);
	}
	const payload = varifyToken(token, "refresh");
	if (!payload) {
		sendResponse(res, { message: "user is not authorized!" });
	}
	const user = await authServices.getUserById(payload.id);
	if (!user) {
		sendResponse(res, { message: "User not found" });
	}
	req.user = user;
	next();
};
