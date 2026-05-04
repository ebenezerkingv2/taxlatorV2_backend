// =============================== TAX HISTORY SERVICE
// src/services/taxHistory.service.ts

// ===============================
import TaxRecord from "../models/TaxRecord.js";
import type { TaxResult } from "../types/index.js";
import type { TaxType } from "../tax/constants/tax.constant.js";

// ===============================
export type SaveTaxHistoryInput = {
	userId: string;
	taxType: TaxType;
	inputSnapshot: Record<string, unknown>;
	outputSnapshot: TaxResult;
	annualTax?: number;
	monthlyTax?: number;
};

// ===============================
export async function saveTaxHistory(data: SaveTaxHistoryInput) {
	const record = await TaxRecord.create({
		userId: data.userId,
		taxType: data.taxType,
		inputSnapshot: data.inputSnapshot,
		outputSnapshot: data.outputSnapshot,
		annualTax: data.annualTax,
		monthlyTax: data.monthlyTax,
	});
	return record;
}

// ===============================
type HistoryQuery = {
	userId: string;
	page?: number;
	limit?: number;
	taxType?: TaxType;
	startDate?: string;
	endDate?: string;
};

// ===============================
export async function getTaxHistoryService({
	userId,
	page = 1,
	limit = 10,
	taxType,
	startDate,
	endDate,
}: HistoryQuery) {
	const safePage = Math.max(page, 1);
	const safeLimit = Math.min(Math.max(limit, 1), 50);
	const skip = (safePage - 1) * safeLimit;

	// ========================== STRICT FILTER
	const filter: {
		userId: string;
		taxType?: TaxType;
		createdAt?: {
			$gte?: Date;
			$lte?: Date;
		};
	} = { userId };

	if (taxType) {
		filter.taxType = taxType;
	}

	// ==========================
	if (startDate || endDate) {
		filter.createdAt = {};

		if (startDate) {
			const start = new Date(startDate);
			if (!isNaN(start.getTime())) {
				filter.createdAt.$gte = start;
			}
		}

		if (endDate) {
			const end = new Date(endDate);
			if (!isNaN(end.getTime())) {
				filter.createdAt.$lte = end;
			}
		}
	}

	// ==========================
	const [records, total] = await Promise.all([
		TaxRecord.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(safeLimit)
			.lean(),

		TaxRecord.countDocuments(filter),
	]);

	return {
		records,
		pagination: {
			total,
			page: safePage,
			limit: safeLimit,
			totalPages: Math.ceil(total / safeLimit),
		},
	};
}
