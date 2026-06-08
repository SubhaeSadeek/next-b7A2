import type { NextFunction, Request, Response } from "express";
import authServices from "../api/services/auth.services";
import type { Role } from "../types";
import { varifyToken } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
	const token = req.headers.authorization;
	if (!token) {
		return sendResponse(
			res,
			{ success: false, message: "token not found" },
			401,
		);
	}
	const payload = varifyToken(token, "access");
	if (!payload) {
		return sendResponse(res, {
			success: false,
			message: "user is not authorized!",
		});
	}
	const user = await authServices.getUserById(payload.id);
	if (!user) {
		return sendResponse(res, { success: false, message: "User not found" });
	}
	req.user = user;
	next();
};

export const authorizingRole = (...roles: Role[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) {
			return sendResponse(res, {
				success: false,
				message: "User is not validated!",
			});
		}
		if (!roles.includes(req.user.role)) {
			return sendResponse(res, {
				success: false,
				message: "You do not have permission",
			});
		}
		next();
	};
};
