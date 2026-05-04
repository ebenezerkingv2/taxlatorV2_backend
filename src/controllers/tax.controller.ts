// =============================== TAX CONTROLLER = SINGLE ENTRY + SOCKET
// src/controllers/tax.controller.ts
// ===============================
import type { Request, Response, NextFunction } from "express";

import { runTaxService } from "../services/tax.service.js";
import { taxSchema } from "../tax/schema/tax.schema.js";
import { getIO } from "../socket/index.js";

// ===============================
export async function calculateTaxController(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const userId = (req as any).user?.id;

		const shouldSave = !!userId;

		// ================= TAX TYPE
		const { taxType } = taxSchema.parse(req.body);

		// ================= RUN SERVICE
		const { result, saved, record } = await runTaxService({
			body: req.body,
			userId,
			shouldSave,
		});

		// ================= SOCKET
		const io = getIO();

		// ================= GLOBAL EVENT
		io.emit("tax:calculated", {
			userId: userId || null,
			taxType,
			result,
			timestamp: new Date(),
		});

		// ================= LIVE HISTORY INSERT
		if (record && userId) {
			io.to(userId).emit("history:insert", {
				_id: record._id,
				taxType: record.taxType,
				annualTax: record.annualTax,
				monthlyTax: record.monthlyTax,
				createdAt: record.createdAt,
				inputSnapshot: record.inputSnapshot,
				outputSnapshot: record.outputSnapshot,
			});
		}

		// ================= RESPONSE
		return res.status(200).json({
			success: true,
			saved,
			data: result,
		});
	} catch (error) {
		next(error);
	}
}
