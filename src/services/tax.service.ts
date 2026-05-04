// =============================== TAX UNIFIED SERVICE
// src/services/tax.service.ts
// ===============================
import { taxFactory } from "../tax/factory/tax.factory.js";
import { taxSchema } from "../tax/schema/tax.schema.js";
import { adaptTaxInput } from "../tax/adaptors/index.js";
import { saveTaxHistory } from "./taxHistory.service.js";

import type { TaxType } from "../tax/constants/tax.constant.js";
import type { ITaxRecord } from "../models/TaxRecord.js";

// ===============================
type RunTaxOptions = {
	body: unknown;
	userId?: string;
	shouldSave?: boolean;
};

// ===============================
export async function runTaxService({
	body,
	userId,
	shouldSave = false,
}: RunTaxOptions) {
	// ================= VALIDATE
	const validated = taxSchema.parse(body);

	// ================= ADAPT
	const adapted = adaptTaxInput(validated);

	// ================= ENGINE
	const result = taxFactory(validated.taxType, adapted);

	let saved = false;

	let record: ITaxRecord | null = null;

	// ================= SAVE (OPTIONAL)
	if (shouldSave && userId) {
		console.log("Saving history for user:", userId);

		record = await saveTaxHistory({
			userId,
			taxType: validated.taxType,
			inputSnapshot: validated,
			outputSnapshot: result,
			annualTax: result.totalAnnualTax,
			monthlyTax: result.monthlyTax,
		});

		saved = true;
	}

	return {
		result,
		taxType: validated.taxType as TaxType,
		saved,
		record,
	};
}
