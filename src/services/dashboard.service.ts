// =============================== DASHBOARD SERVICE
// src/services/dashboard.service.ts

// =====================================
import mongoose from "mongoose";
import TaxRecord from "../models/TaxRecord.js";
import { TAX_CONFIG, type TaxType } from "../tax/constants/tax.constant.js";

// =====================================
export async function getDashboardStats(userId: string) {
	const objectUserId = new mongoose.Types.ObjectId(userId);

	// =============================== RECENT RECORDS
	const records = await TaxRecord.find({ userId })
		.sort({ createdAt: -1 })
		.limit(5);

	// =============================== TOTALS (SINGLE AGGREGATION)
	const totalsAgg = await TaxRecord.aggregate([
		{
			$match: {
				userId: objectUserId,
			},
		},
		{
			$group: {
				_id: null,
				totalAnnual: { $sum: "$annualTax" },
				totalMonthly: { $sum: "$monthlyTax" },
			},
		},
	]);

	const totals = totalsAgg[0] || {};

	const totalAnnualTax = totals.totalAnnual ?? 0;
	const totalMonthlyTax = totals.totalMonthly ?? 0;

	// =============================== SAFE TAX TYPE GUARD
	const lastCalculation = records[0];

	const lastType =
		lastCalculation &&
		typeof lastCalculation.taxType === "string" &&
		lastCalculation.taxType in TAX_CONFIG
			? (lastCalculation.taxType as TaxType)
			: undefined;

	// ===============================
	return {
		estimatedTax: totalAnnualTax,
		estimatedMonthlyTax: totalMonthlyTax,

		lastCalculation: lastType
			? TAX_CONFIG[lastType].label
			: "No calculations yet",

		nextDeadline: lastType ? TAX_CONFIG[lastType].deadline : "No deadline",

		recent: records.map((item) => ({
			id: item._id.toString(),
			type: item.taxType,
			label: TAX_CONFIG[item.taxType as TaxType]?.label ?? item.taxType,
			annualTax: item.annualTax,
			monthlyTax: item.monthlyTax,
			createdAt: item.createdAt,
		})),
	};
}