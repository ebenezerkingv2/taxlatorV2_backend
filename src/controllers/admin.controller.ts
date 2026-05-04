// =============================== ADMIN CONTROLLER
// src/controllers/admin.controller.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import {
	getAdminOverview,
	getTaxTypeDistribution,
	getPerformanceSnapshot,
	getTopUsers,
} from "../services/adminDashboard.service.js";
import { sendSuccess } from "../utils/response.js";

// ===============================
export async function adminDashboardController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const [overview, taxDistribution, performance, topUsers] =
			await Promise.all([
				getAdminOverview(),
				getTaxTypeDistribution(),
				getPerformanceSnapshot(),
				getTopUsers(),
			]);

		return sendSuccess(res, {
			overview,
			taxDistribution,
			performance,
			topUsers,
		});
	} catch (error) {
		next(error);
	}
}