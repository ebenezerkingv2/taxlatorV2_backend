// =============================== ADAPTOR FREELANCER
// src/tax/adaptors/freelancer.adaptor.ts

// ===============================
import type { TaxZodInput } from "../schema/tax.schema.js";

import type { FreelancerInput } from "../../types/index.js";

// ===============================
export function adaptFreelancerInput(
	input: TaxZodInput & { taxType: "FREELANCER" },
): FreelancerInput {
	const data = input.data;
	return {
		grossAnnualIncome: data.grossAnnualIncome,
		totalBusinessExpenses: data.totalBusinessExpenses ?? 0,
		pensionContribution: data.pensionContribution ?? 0,
	};
}
