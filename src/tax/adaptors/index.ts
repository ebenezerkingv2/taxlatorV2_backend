// =============================== ADAPTOR INDEX
// src/tax/adaptors/index.ts

// ===============================
import type { TaxZodInput } from "../schema/tax.schema.js";
import { adaptPayeInput } from "./paye.adapter.js";
import { adaptCitInput } from "./cit.adapter.js";
import { adaptVatInput } from "./vat.adapter.js";
import { adaptFreelancerInput } from "./freelancer.adapter.js";

// ===============================
export function adaptTaxInput(input: TaxZodInput) {
	switch (input.taxType) {
		case "PAYE":
			return adaptPayeInput(input);
		case "FREELANCER":
			return adaptFreelancerInput(input);
		case "CIT":
			return adaptCitInput(input);
		case "VAT":
			return adaptVatInput(input);
		default:
			throw new Error("Unsupported tax type");
	}
}
