// =============================== ANALYTICS SERVICE
// src/services/analytics.service.ts

// ===============================
import RequestLog from "../models/ApiLog.js";
import TaxRecord from "../models/TaxRecord.js";

// =============================== PERFORMANCE METRICS
export async function getApiPerformanceStats() {
	const stats = await RequestLog.aggregate([
		{
			$group: {
				_id: "$path",
				avgDuration: { $avg: "$durationMs" },
				count: { $sum: 1 },
				errorCount: {
					$sum: {
						$cond: [{ $gte: ["$statusCode", 400] }, 1, 0],
					},
				},
			},
		},
		{ $sort: { avgDuration: -1 } },
	]);

	return stats;
}

// =============================== USAGE STATS
export async function getTaxUsageStats() {
	const stats = await TaxRecord.aggregate([
		{
			$group: {
				_id: "$taxType",
				count: { $sum: 1 },
				avgAnnualTax: { $avg: "$annualTax" },
				avgMonthlyTax: { $avg: "$monthlyTax" },
			},
		},
		{ $sort: { count: -1 } },
	]);

	return stats;
}

// =============================== ACTIVITY STATS
export async function getUserActivityStats() {
	const stats = await RequestLog.aggregate([
		{
			$group: {
				_id: "$userId",
				requestCount: { $sum: 1 },
				avgResponseTime: { $avg: "$durationMs" },
			},
		},
		{ $sort: { requestCount: -1 } },
	]);

	return stats;
}