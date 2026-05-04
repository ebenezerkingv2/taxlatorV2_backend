// =============================== TAX SCHEMA GUARD
// src/tax/schema/tax.guard.ts

// ===============================
import { taxSchema } from "./tax.schema.js";
import type { TaxZodInput } from "./tax.schema.js";
import { AppError } from "../../utils/AppError.js";

// ===============================
export function validateTaxSchema(payload: unknown): TaxZodInput {
	const result = taxSchema.safeParse(payload);

	if (!result.success) {
		throw new AppError("Validation failed", 400, result.error.issues);
	}

	return result.data;
}
