// =============================== ADAPTOR VAT
// src/tax/adaptors/vat.adaptor.ts

// ===============================
import type { TaxZodInput } from "../schema/tax.schema.js";
import type { VATInput } from "../../types/index.js";

// ===============================
const VAT_RATE_MAP = {
	Domestic: 0.075,
	Digital: 0.075,
	Export: 0,
	Exempt: 0,
};

// ===============================
export function adaptVatInput(
	input: TaxZodInput & { taxType: "VAT" },
): VATInput {
	const data = input.data;
	return {
		transactionAmount: data.transactionAmount,
		calculationType: data.calculationType,
		transactionType: data.transactionType,
	};
}
