import type { NextFunction, Request, Response } from "express";

export function globalErrorHandler(
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	res.status(500).json({
		success: false,
		message: err instanceof Error ? err.message : "internal server error",
	});
}
