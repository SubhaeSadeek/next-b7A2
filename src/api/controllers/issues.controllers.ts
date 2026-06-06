import type { Request, Response } from "express";
import {
	isReportStatus,
	isReportType,
	isSortOption,
	type IssueQuery,
} from "../../types";
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

const getAllIssues = async (req: Request, res: Response) => {
	const { sort, type, status } = req.query;

	// validating query params according to given values
	if (sort && (typeof sort !== "string" || !isSortOption(sort))) {
		return sendResponse(
			res,
			{
				message: "Invalid sort value in query params",
			},
			400,
		);
	}

	if (type && (typeof type !== "string" || !isReportType(type))) {
		return sendResponse(
			res,
			{
				message: "Invalid type value in query params",
			},
			400,
		);
	}

	if (status && (typeof status !== "string" || !isReportStatus(status))) {
		return sendResponse(
			res,
			{
				message: "Invalid status value in query params",
			},
			400,
		);
	}
	// setting quary params in an object named paramsFromQuery that will be pass as argument.
	const paramsFromQuery: IssueQuery = {};

	if (typeof sort === "string" && isSortOption(sort)) {
		paramsFromQuery.sort = sort;
	}

	if (typeof type === "string" && isReportType(type)) {
		paramsFromQuery.type = type;
	}

	if (typeof status === "string" && isReportStatus(status)) {
		paramsFromQuery.status = status;
	}
	// getting result/data from service
	const result = await issuesServices.getAllIssuesFromDB(paramsFromQuery);
	if (result.length === 0) {
		return sendResponse(res, {
			message:
				"Please set your query properly or NO data available for this query",
		});
	}
	return sendResponse(
		res,
		{
			message: "issues given according to query",
			data: result,
		},
		200,
	);
};
export const issuesController = {
	createIssue,
	getAllIssues,
};
