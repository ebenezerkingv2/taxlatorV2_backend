// =============================== TYPES TAX RESULT
// src/types/taxResult.type.ts

// ===============================
import type { TaxType } from "../../tax/constants/tax.constant.js";

// ===============================
export type TaxBreakdownItem = {
	label: string;
	rate: number;
	taxableAmount: number;
	tax: number;
};

// ===============================
export type TaxResult = {
	taxType: TaxType;

	grossAnnualIncome: number;
	taxableIncome: number;

	totalAnnualTax: number;
	monthlyTax: number;

	netAnnualIncome: number;
	netMonthlyIncome: number;

	taxBreakdown: TaxBreakdownItem[];

	deductions?: Record<string, number | boolean | string>;
	meta?: Record<string, any>;
};
