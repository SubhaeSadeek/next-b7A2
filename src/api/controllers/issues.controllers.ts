import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import issuesServices from "../services/issues.services";

// as error is handeled as a middleware in app.ts, it is not reapeated by having try... catch block here. the name of the middleware is --globalErrorHandler.ts--
const createIssue = async (req: Request, res: Response) => {
	const reporterId = req.user?.id;
	if (!reporterId) {
		return sendResponse(res, { message: "user not found" });
	}
	const result = await issuesServices.createIssueInDB(
		req.body,
		req.user?.id as number,
	);
	return sendResponse(
		res,
		{ message: "Issue created successfully", data: result },
		201,
	);
};

export const issuesController = {
	createIssue,
};
