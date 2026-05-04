// =============================== ENGINE LOGIC CIT
// src/tax/engines/cit.engine.ts

// ===============================
import { TAX_TYPES } from "../constants/tax.constant.js";
import type { CITInput, TaxResult } from "../../types/index.js";

import { AppError } from "../../utils/AppError.js";

// ===============================
export function citEngine(input: CITInput): TaxResult {
	const {
		annualTurnover,
		taxableProfit,
		fixedAssets = 0,
		accountingProfit = 0,
		companySize,
		isMultinational = false,
		citRate = 0.3,
	} = input;

	// ================= VALIDATION =================
	if (
		annualTurnover == null ||
		taxableProfit == null ||
		annualTurnover < 0 ||
		taxableProfit < 0 ||
		fixedAssets < 0
	) {
		throw new AppError(
			"annualTurnover, taxableProfit and fixedAssets must be valid numbers ≥ 0",
			400,
		);
	}

	// ================= COMPANY CLASSIFICATION =================
	const derivedIsSmall =
		annualTurnover <= 50_000_000 && fixedAssets <= 250_000_000;

	let finalCompanySize: "SMALL" | "OTHER" | "MULTINATIONAL";

	if (companySize) {
		finalCompanySize = companySize;
	} else if (isMultinational) {
		finalCompanySize = "MULTINATIONAL";
	} else if (derivedIsSmall) {
		finalCompanySize = "SMALL";
	} else {
		finalCompanySize = "OTHER";
	}

	// ================= TAX CALCULATION =================
	let totalAnnualTax = 0;
	let appliedRate = citRate;
	let minimumTax = 0;
	let normalCIT = 0;
	let minimumTaxApplied = false;

	const taxBreakdown: any[] = [];

	// ================= SMALL COMPANY =================
	if (finalCompanySize === "SMALL") {
		totalAnnualTax = 0;

		taxBreakdown.push({
			label: "Small Company Relief (0%)",
			rate: 0,
			taxableAmount: taxableProfit,
			tax: 0,
		});
	}

	// ================= OTHER COMPANY =================
	else if (finalCompanySize === "OTHER") {
		totalAnnualTax = Math.round(taxableProfit * citRate);

		taxBreakdown.push({
			label: `CIT (${citRate * 100}%)`,
			rate: citRate,
			taxableAmount: taxableProfit,
			tax: totalAnnualTax,
		});
	}

	// ================= MULTINATIONAL =================
	else if (finalCompanySize === "MULTINATIONAL") {
		normalCIT = Math.round(taxableProfit * 0.3);
		minimumTax = Math.round(accountingProfit * 0.15);

		totalAnnualTax = Math.max(normalCIT, minimumTax);
		minimumTaxApplied = minimumTax > normalCIT;

		appliedRate = minimumTaxApplied ? 0.15 : 0.3;

		taxBreakdown.push(
			{
				label: "Normal CIT (30%)",
				rate: 0.3,
				taxableAmount: taxableProfit,
				tax: normalCIT,
			},
			{
				label: "Minimum Tax (15%)",
				rate: 0.15,
				taxableAmount: accountingProfit,
				tax: minimumTax,
			},
			{
				label: "Final Tax Payable",
				rate: appliedRate,
				taxableAmount: minimumTaxApplied ? accountingProfit : taxableProfit,
				tax: totalAnnualTax,
			},
		);
	}

	// ================= FINAL =================
	const netAnnualIncome = taxableProfit - totalAnnualTax;

	return {
		taxType: TAX_TYPES.CIT,
		grossAnnualIncome: annualTurnover,
		taxableIncome: taxableProfit,

		totalAnnualTax,
		monthlyTax: Math.round(totalAnnualTax / 12),

		netAnnualIncome,
		netMonthlyIncome: Math.round(netAnnualIncome / 12),

		meta: {
			companySize: finalCompanySize,
			appliedRate,
			minimumTaxApplied,
			normalCIT,
			minimumTax,
		},

		deductions: {
			fixedAssets,
			accountingProfit,
		},

		taxBreakdown,
	};
}
