// =============================== ADAPTOR PAYE / PIT
// src/tax/adaptors/paye.adaptor.ts

// ===============================
import type { TaxZodInput } from "../schema/tax.schema.js";
import type { PayeInput } from "../../types/index.js";

// ===============================
export function adaptPayeInput(
	input: TaxZodInput & { taxType: "PAYE" },
): PayeInput {
	const data = input.data;
	return {
		grossAnnualIncome: data.grossAnnualIncome,
		payePensionContribution: data.payePensionContribution,
		nationalHealthInsuranceScheme: data.nationalHealthInsuranceScheme,
		nationalHousingFund: data.nationalHousingFund,
		otherDeductions: data.otherDeductions ?? 0,
	};
}
