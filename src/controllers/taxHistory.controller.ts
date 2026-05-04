// =============================== TAX HISTORY CONTROLLER
// src/controllers/taxHistory.controller.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import { getTaxHistoryService } from "../services/taxHistory.service.js";
import { sendSuccess } from "../utils/response.js";

import type { TaxType } from "../tax/constants/tax.constant.js";

// ===============================
export const getTaxHistoryController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = (req as any).user?.id;
		const { page = "1", limit = "10", taxType, startDate, endDate } = req.query;
		const result = await getTaxHistoryService({
			userId,
			page: Number(page),
			limit: Number(limit),
			taxType: taxType as TaxType | undefined,
			startDate: startDate as string | undefined,
			endDate: endDate as string | undefined,
		});
		return sendSuccess(res, result, "Tax history fetched successfully");
	} catch (error) {
		next(error);
	}
};
