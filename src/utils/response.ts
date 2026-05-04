// =============================== API RESPONSE HELPER
// src/utils/response.ts

// ===============================
import type { Response } from "express";
import type { ApiResponse } from "../types/api/apiResponse.type.js";

// ===============================
export function sendSuccess<T>(
	res: Response,
	data: T,
	message = "Request successful",
	statusCode = 200,
	meta?: ApiResponse<T>["meta"],
) {
	const response: ApiResponse<T> = {
		success: true,
		message,
		data,
		meta: meta ?? {
			requestId: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			saved: false,
		},
	};

	return res.status(statusCode).json(response);
}

// ===============================
export function sendError(
	res: Response,
	message = "Something went wrong",
	statusCode = 500,
	errors?: any,
) {
	const response: ApiResponse<null> = {
		success: false,
		message,
		data: null,
		meta: {
			requestId: crypto.randomUUID(),
			timestamp: new Date().toISOString(),
			saved: false,
		},
		errors,
	};

	return res.status(statusCode).json(response);
}
