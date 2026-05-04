// =============================== ENGINE LOGIC VAT
// src/tax/engines/vat.engine.ts

// ===============================
import { TAX_TYPES } from "../constants/tax.constant.js";
import type {
	VATInput,
	CalculationType,
	TransactionType,
	TaxResult,
} from "../../types/index.js";

import { AppError } from "../../utils/AppError.js";

// ===============================
const VAT_RATES: Record<TransactionType, number> = {
	DOMESTIC: 0.075,
	DIGITAL: 0.075,
	EXPORT: 0,
	EXEMPT: 0,
};

// ===============================
export function vatEngine(input: VATInput): TaxResult {
	const { transactionAmount, calculationType, transactionType } = input;

	if (transactionAmount == null || transactionAmount < 0) {
		throw new AppError("Transaction amount must be >= 0", 400);
	}

	const vatRate = VAT_RATES[transactionType];

	let vatAmount = 0;
	let baseAmount = 0;

	// ================= ZERO VAT =================
	if (vatRate === 0 || transactionAmount === 0) {
		return {
			taxType: TAX_TYPES.VAT,
			grossAnnualIncome: transactionAmount,
			taxableIncome: transactionAmount,
			totalAnnualTax: 0,
			monthlyTax: 0,
			netAnnualIncome: transactionAmount,
			netMonthlyIncome: Math.round(transactionAmount / 12),
			taxBreakdown: [
				{
					label: `${transactionType} (0% VAT)`,
					rate: 0,
					taxableAmount: transactionAmount,
					tax: 0,
				},
			],
			deductions: {},
			meta: {
				calculationType,
				transactionType,
				vatRate,
			},
		};
	}

	// ================= CALCULATION =================
	if (calculationType === "ADD") {
		baseAmount = transactionAmount;
		vatAmount = baseAmount * vatRate;
	} else {
		baseAmount = transactionAmount / (1 + vatRate);
		vatAmount = transactionAmount - baseAmount;
	}

	const roundedVat = Math.round(vatAmount);
	const roundedBase = Math.round(baseAmount);

	return {
		taxType: TAX_TYPES.VAT,
		grossAnnualIncome: transactionAmount,
		taxableIncome: roundedBase,

		totalAnnualTax: roundedVat,
		monthlyTax: Math.round(roundedVat / 12),

		netAnnualIncome: roundedBase,
		netMonthlyIncome: Math.round(roundedBase / 12),

		taxBreakdown: [
			{
				label: `${transactionType} VAT (${(vatRate * 100).toFixed(1)}%)`,
				rate: vatRate,
				taxableAmount: roundedBase,
				tax: roundedVat,
			},
		],

		deductions: {},

		meta: {
			calculationType,
			transactionType,
			vatRate,
		},
	};
}
