// =============================== TYPES INDEX
// src/types/index.ts

// ===============================
export type { ApiMeta, ApiResponse } from "./api/apiResponse.type.js";

export type { TaxEngine } from "./tax/taxEngine.type.js";

export type {
	PayeInput,
	FreelancerInput,
	CITInput,
	VATInput,
	TaxInputMap,
	CalculationType,
	TransactionType,
} from "./tax/taxInput.type.js";

export type { TaxResult, TaxBreakdownItem } from "./tax/taxResult.type.js";

export type { User } from "./user/user.type.js";