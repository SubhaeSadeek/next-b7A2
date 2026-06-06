import type { Response } from "express";

export function sendResponse<T>(
	res: Response,
	{ success, message, data }: { success: boolean; message: unknown; data?: T },
	status = 200,
): void {
	res.status(status).json({
		success,
		message,
		data: success ? data : undefined,
	});
}
