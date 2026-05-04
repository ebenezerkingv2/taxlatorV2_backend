// =============================== TAX ENGINE FACTORY CORE
// src/tax/factory/tax.factory.ts

// ===============================
import { taxEngineRegistry } from "./tax.registry.js";

import type { TaxInputMap, TaxResult } from "../../types/index.js";
import type { TaxType } from "../constants/tax.constant.js";
import { TAX_TYPES } from "../constants/tax.constant.js";

// ===============================
class AppError extends Error {
	statusCode: number;
	constructor(message: string, statusCode = 400) {
		super(message);
		this.statusCode = statusCode;
	}
}

// ===============================
export function taxFactory<T extends TaxType>(
	taxType: T,
	data: TaxInputMap[T],
): TaxResult {
	const engine = taxEngineRegistry[taxType];
	if (!engine) {
		throw new AppError("Invalid tax type", 400);
	}
	return engine(data);
}
