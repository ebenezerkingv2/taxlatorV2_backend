// =============================== ENGINE LOGIC PAYE / PIT
// src/tax/engines/paye.engine.ts

// ===============================
import { TAX_TYPES } from "../constants/tax.constant.js";
import type { PayeInput, TaxResult } from "../../types/index.js";

import { AppError } from "../../utils/AppError.js";

// ===============================
export type TaxBreakdownItem = {
	label: string;
	rate: number;
	taxableAmount: number;
	tax: number;
};

// ===============================
export function payeEngine(input: PayeInput): TaxResult {
	const {
		grossAnnualIncome,
		otherDeductions = 0,
		nationalHealthInsuranceScheme = false,
		nationalHousingFund = false,
		payePensionContribution = true,
	} = input;

	// ================= VALIDATION =================
	if (grossAnnualIncome == null || grossAnnualIncome < 0) {
		throw new AppError("Invalid income", 400);
	}

	// ================= RELIEFS =================
	// CRA (Consolidated Relief Allowance)
	const craFixed = 200000;
	const craPercent = grossAnnualIncome * 0.2;
	const craOnePercent = grossAnnualIncome * 0.01;

	const cra = Math.round(Math.max(craFixed, craOnePercent) + craPercent);

	// Pension (8% assumed employee contribution)
	const pension = payePensionContribution
		? Math.round(grossAnnualIncome * 0.08)
		: 0;

	// NHIS (optional — depends on implementation)
	const nhis = nationalHealthInsuranceScheme
		? Math.round(grossAnnualIncome * 0.05)
		: 0;

	// NHF (2.5%)
	const nhf = nationalHousingFund ? Math.round(grossAnnualIncome * 0.025) : 0;

	// ================= TOTAL DEDUCTIONS =================
	const deductions = {
		cra,
		pension,
		nhis,
		nhf,
		otherDeductions,
	};

	const totalDeductions = cra + pension + nhis + nhf + otherDeductions;

	const taxableIncome = Math.max(grossAnnualIncome - totalDeductions, 0);

	// ================= TAX BREAKDOWN =================
	const taxBreakdown: TaxBreakdownItem[] = [];

	if (taxableIncome === 0) {
		return {
			taxType: TAX_TYPES.PAYE,
			grossAnnualIncome,
			taxableIncome: 0,
			totalAnnualTax: 0,
			monthlyTax: 0,
			netAnnualIncome: grossAnnualIncome,
			netMonthlyIncome: Math.round(grossAnnualIncome / 12),
			deductions,
			taxBreakdown,
		};
	}

	// ================= TAX BANDS =================
	const bands = [
		{ limit: 300000, rate: 0.07, label: "₦0 - ₦300,000" },
		{ limit: 600000, rate: 0.11, label: "₦300,001 - ₦600,000" },
		{ limit: 1100000, rate: 0.15, label: "₦600,001 - ₦1,100,000" },
		{ limit: 1600000, rate: 0.19, label: "₦1,100,001 - ₦1,600,000" },
		{ limit: 3200000, rate: 0.21, label: "₦1,600,001 - ₦3,200,000" },
		{ limit: Infinity, rate: 0.24, label: "Above ₦3,200,000" },
	];

	let remainingIncome = taxableIncome;
	let totalAnnualTax = 0;

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

	// ================= FINAL =================
	const netAnnualIncome = grossAnnualIncome - totalAnnualTax;

	return {
		taxType: TAX_TYPES.PAYE,
		grossAnnualIncome,
		taxableIncome,
		totalAnnualTax,
		monthlyTax: Math.round(totalAnnualTax / 12),
		netAnnualIncome,
		netMonthlyIncome: Math.round(netAnnualIncome / 12),
		deductions,
		taxBreakdown,
	};
}
