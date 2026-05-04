// =============================== ENGINE LOGIC FREELANCER
// src/tax/engines/freelancer.engine.ts

// ===============================
import { TAX_TYPES } from "../constants/tax.constant.js";
import type { FreelancerInput, TaxResult } from "../../types/index.js";

import { AppError } from "../../utils/AppError.js";

// ===============================
export function freelancerEngine(input: FreelancerInput): TaxResult {
	const {
		grossAnnualIncome,
		totalBusinessExpenses = 0,
		pensionContribution = 0,
	} = input;

	if (grossAnnualIncome == null || grossAnnualIncome < 0) {
		throw new AppError("...", 400);
	}

	const totalDeductions = totalBusinessExpenses + pensionContribution;
	const taxableIncome = Math.max(grossAnnualIncome - totalDeductions, 0);

	// ================= ZERO CASE =================
	if (taxableIncome === 0) {
		return {
			taxType: TAX_TYPES.FREELANCER,
			grossAnnualIncome,
			taxableIncome: 0,
			totalAnnualTax: 0,
			monthlyTax: 0,
			netAnnualIncome: grossAnnualIncome,
			netMonthlyIncome: Math.round(grossAnnualIncome / 12),
			taxBreakdown: [],
			deductions: {
				totalBusinessExpenses,
				pensionContribution,
			},
		};
	}

	// ================= TAX BANDS =================
	const bands = [
		{ limit: 800000, rate: 0, label: "0 - ₦800,000" },
		{ limit: 3000000, rate: 0.15, label: "₦800,001 - ₦3,000,000" },
		{ limit: 12000000, rate: 0.18, label: "₦3,000,001 - ₦12,000,000" },
		{ limit: 25000000, rate: 0.21, label: "₦12,000,001 - ₦25,000,000" },
		{ limit: 50000000, rate: 0.23, label: "₦25,000,001 - ₦50,000,000" },
		{ limit: Infinity, rate: 0.25, label: "Above ₦50,000,000" },
	];

	let remainingIncome = taxableIncome;
	let totalAnnualTax = 0;

	const taxBreakdown: TaxResult["taxBreakdown"] = [];

	for (let i = 0; i < bands.length; i++) {
		const band = bands[i];
		const prevLimit = i === 0 ? 0 : bands[i - 1].limit;

		if (remainingIncome <= 0) break;

		const bandRange = band.limit - prevLimit;
		const taxableAmount = Math.min(remainingIncome, bandRange);
		const tax = Math.round(taxableAmount * band.rate);

		totalAnnualTax += tax;

		taxBreakdown.push({
			label: band.label,
			rate: band.rate,
			taxableAmount,
			tax,
		});

		remainingIncome -= taxableAmount;
	}

	const netAnnualIncome = grossAnnualIncome - totalAnnualTax;

	return {
		taxType: TAX_TYPES.FREELANCER,
		grossAnnualIncome,
		taxableIncome,

		totalAnnualTax,
		monthlyTax: Math.round(totalAnnualTax / 12),

		netAnnualIncome,
		netMonthlyIncome: Math.round(netAnnualIncome / 12),

		deductions: {
			totalBusinessExpenses,
			pensionContribution,
		},
		taxBreakdown,
	};
}
