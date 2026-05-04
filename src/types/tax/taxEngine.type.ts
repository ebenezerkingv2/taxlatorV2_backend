// =============================== TYPES TAX INPUT
// src/types/taxEngine.type.ts

// ===============================
import type { TaxResult } from "./taxResult.type.js";
import type { TaxInputMap } from "./taxInput.type.js";
import type { TaxType } from "../../tax/constants/tax.constant.js";

// ===============================
export type TaxEngine<K extends TaxType> = (input: TaxInputMap[K]) => TaxResult;
