// =============================== ERROR MIDDLEWARE
// src/middlewares/error.middleware.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.js";

// ===============================
export const errorMiddleware = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const statusCode = err.statusCode || 500;

	return sendError(
		res,
		err.message || "Internal Server Error",
		statusCode,
		err.errors || null,
	);
};
