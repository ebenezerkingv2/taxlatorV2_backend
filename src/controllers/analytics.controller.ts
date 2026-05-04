// =============================== ANALYTICS CONTROLLER
// src/controllers/analytics.controller.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import {
	getApiPerformanceStats,
	getTaxUsageStats,
	getUserActivityStats,
} from "../services/analytics.service.js";
import { sendSuccess } from "../utils/response.js";

export async function analyticsController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const [performance, taxUsage, users] = await Promise.all([
			getApiPerformanceStats(),
			getTaxUsageStats(),
			getUserActivityStats(),
		]);

		return sendSuccess(
			res,
			{
				performance,
				taxUsage,
				users,
			},
			"Analytics fetched",
		);
	} catch (error) {
		next(error);
	}
}