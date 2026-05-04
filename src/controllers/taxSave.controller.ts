// =============================== TAX SAVE CONTROLLER
// src/controllers/taxSave.controller.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import { runTaxService } from "../services/tax.service.js";

// ===============================
export async function calculateAndSaveTaxController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const userId = (req as any).user?.id;

		const { result, saved } = await runTaxService({
			body: req.body,
			userId,
			shouldSave: true,
		});

		return res.status(200).json({
			success: true,
			saved,
			data: result,
		});
	} catch (error) {
		next(error);
	}
}
