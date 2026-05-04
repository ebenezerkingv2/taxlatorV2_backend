// =============================== ADAPTOR CIT
// src/tax/adaptors/cit.adaptor.ts

// ===============================
import type { TaxZodInput } from "../schema/tax.schema.js";

import type { CITInput } from "../../types/index.js";

// ===============================
export function adaptCitInput(
	input: TaxZodInput & { taxType: "CIT" },
): CITInput {
	const data = input.data;
	return {
		annualTurnover: data.annualTurnover,
		taxableProfit: data.taxableProfit,
		fixedAssets: data.fixedAssets ?? 0,
		accountingProfit: data.accountingProfit ?? 0,
		companySize: data.companySize,
		isMultinational: data.isMultinational ?? false,
		citRate: data.citRate ?? 0.3,
	};
}
