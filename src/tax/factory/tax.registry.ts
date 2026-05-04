// =============================== ENGINE REGISTRY
// src/tax/factory/tax.registry.ts

// ===============================
import { payeEngine } from "../engines/paye.engine.js";
import { freelancerEngine } from "../engines/freelancer.engine.js";
import { citEngine } from "../engines/cit.engine.js";
import { vatEngine } from "../engines/vat.engine.js";
import { TAX_TYPES } from "../constants/tax.constant.js";
import type { TaxEngine, TaxResult, TaxInputMap } from "../../types/index.js";
import type { TaxType } from "../constants/tax.constant.js";

// ===============================
export const taxEngineRegistry: {
	[K in TaxType]: TaxEngine<K>;
} = {
	[TAX_TYPES.PAYE]: payeEngine,
	[TAX_TYPES.FREELANCER]: freelancerEngine,
	[TAX_TYPES.CIT]: citEngine,
	[TAX_TYPES.VAT]: vatEngine,
};
