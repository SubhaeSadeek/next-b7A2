import type { Request, Response } from "express";
import {
	isReportStatus,
	isReportType,
	isRole,
	isSortOption,
	type IssueQuery,
} from "../../types";
import { sendResponse } from "../../utils/sendResponse";
import issuesServices from "../services/issues.services";

// as error is handeled as a middleware in app.ts, it is not reapeated by having try... catch block here. the name of the middleware is --globalErrorHandler.ts--
const createIssue = async (req: Request, res: Response) => {
	const reporterId = req.user?.id;
	if (!reporterId) {
		return sendResponse(res, { success: false, message: "user not found" });
	}
	const result = await issuesServices.createIssueInDB(
		req.body,
		req.user?.id as number,
	);
	return sendResponse(
		res,
		{ success: true, message: "Issue created successfully", data: result },
		201,
	);
};
// get all issues by query params and send res accordingly
const getAllIssues = async (req: Request, res: Response) => {
	const { sort, type, status } = req.query;

	// validating query params according to given values
	if (sort && (typeof sort !== "string" || !isSortOption(sort))) {
		return sendResponse(
			res,
			{
				success: false,
				message: "Invalid sort value in query params",
			},
			400,
		);
	}

	if (type && (typeof type !== "string" || !isReportType(type))) {
		return sendResponse(
			res,
			{
				success: false,
				message: "Invalid type value in query params",
			},
			400,
		);
	}

	if (status && (typeof status !== "string" || !isReportStatus(status))) {
		return sendResponse(
			res,
			{
				success: false,
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
			success: false,
			message: "NO data available for this query",
		});
	}
	return sendResponse(
		res,
		{
			success: true,
			message: "issues given according to query",
			data: result,
		},
		200,
	);
};

// get single issue by issue id
const getSingleIssue = async (req: Request, res: Response) => {
	const id = parseInt(req.params.issueId as string); // param is /:issueId

	if (isNaN(id)) {
		return sendResponse(res, {
			success: false,
			message: "Issue ID must be in number",
		});
	}
	const result = await issuesServices.getSingleIssueFromDB(id);
	if (!result) {
		return sendResponse(
			res,
			{ success: false, message: "Can not find issue with this id" },
			500,
		);
	}
	return sendResponse(
		res,
		{ success: true, message: "Issue retrived successfully", data: result },
		200,
	);
};

// Update an issue (ROLE BASED)

const updateIssue = async (req: Request, res: Response) => {
	const id = parseInt(req.params.issueId as string); // param is /:issueId

	if (isNaN(id)) {
		return sendResponse(res, {
			success: false,
			message: "Issue ID must be in number",
		});
	}
	if (!req.user?.role || !isRole(req.user?.role)) {
		return sendResponse(
			res,
			{
				success: false,
				message: "You are not allowed, Only authorized person is acceptable",
			},
			404,
		);
	}

	const result = await issuesServices.updateIssuesFromDB(
		req.body,
		id,
		req.user?.role,
		req.user?.id,
	);
	if (!result) {
		return sendResponse(res, {
			success: false,
			message: "Data can not be updated",
		});
	}
	return sendResponse(res, {
		success: true,
		message: "Issue updated successfully",
		data: result,
	});
};

// delete an issue
const deleteIssue = async (req: Request, res: Response) => {
	const id = parseInt(req.params.issueId as string); // param is /:issueId

	if (isNaN(id)) {
		return sendResponse(res, {
			success: false,
			message: "Issue ID must be in number",
		});
	}

	if (!req.user?.role) {
		return sendResponse(res, {
			success: false,
			message: "Unouthorize! Only maintainer can delete an issue",
		});
	}
	const result = await issuesServices.deleteIssueFromDB(id, req.user?.role);
	if (!result) {
		return sendResponse(res, {
			success: false,
			message: "Issue can not be deleted! Not found in DB",
		});
	}

	return sendResponse(res, {
		success: true,
		message: "Issue deleted successfully",
	});
};
export const issuesController = {
	createIssue,
	getAllIssues,
	getSingleIssue,
	updateIssue,
	deleteIssue,
};
