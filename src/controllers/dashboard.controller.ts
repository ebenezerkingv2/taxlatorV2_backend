// =============================== DASHBOARD CONTROLLER
// src/controllers/dashboard.controller.ts

// ===============================
import type { Request, Response, NextFunction } from "express";

import { getDashboardStats } from "../services/dashboard.service.js";
import { sendSuccess } from "../utils/response.js";

// ===============================
export async function dashboardController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const userId = (req as any).user.id;

		const data = await getDashboardStats(userId);

		return sendSuccess(res, data, "Dashboard fetched");
	} catch (error) {
		next(error);
	}
}