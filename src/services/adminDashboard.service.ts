// =============================== ADMIN SERVICE
// src/services/adminDashboard.service.ts

// ===============================
import TaxRecord from "../models/TaxRecord.js";
import User from "../models/User.js";
import ApiLog from "../models/ApiLog.js";

// =============================== OVERVIEW METRICS
export async function getAdminOverview() {
	const [users, taxes, logs] = await Promise.all([
		User.countDocuments(),
		TaxRecord.countDocuments(),
		ApiLog.countDocuments(),
	]);

	return {
		totalUsers: users,
		totalTaxCalculations: taxes,
		totalRequests: logs,
	};
}

// =============================== TAX TYPE DISTRIBUTION
export async function getTaxTypeDistribution() {
	return TaxRecord.aggregate([
		{
			$group: {
				_id: "$taxType",
				count: { $sum: 1 },
				totalTax: { $sum: "$annualTax" },
			},
		},
		{ $sort: { count: -1 } },
	]);
}

// =============================== PERFORMANCE SNAPSHOT
export async function getPerformanceSnapshot() {
	return ApiLog.aggregate([
		{
			$group: {
				_id: null,
				avgResponseTime: { $avg: "$durationMs" },
				errorRate: {
					$avg: {
						$cond: [{ $gte: ["$statusCode", 400] }, 1, 0],
					},
				},
			},
		},
	]);
}

// =============================== TOP USERS
export async function getTopUsers() {
	return ApiLog.aggregate([
		{
			$group: {
				_id: "$userId",
				requests: { $sum: 1 },
				avgTime: { $avg: "$durationMs" },
			},
		},
		{ $sort: { requests: -1 } },
		{ $limit: 10 },
	]);
}
