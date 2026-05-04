// ===================================== TAX DEADLINES
// src/tax/constants/tax.constant.ts

// ===============================
export const TAX_TYPES = {
	CIT: "CIT",
	PAYE: "PAYE",
	VAT: "VAT",
	FREELANCER: "FREELANCER",
} as const;

export type TaxType = (typeof TAX_TYPES)[keyof typeof TAX_TYPES];

export const TAX_CONFIG: Record<TaxType, { deadline: string; label: string }> =
	{
		CIT: { deadline: "30 April", label: "Company Income Tax" },
		PAYE: { deadline: "10th of next month", label: "Pay As You Earn" },
		VAT: { deadline: "21st of next month", label: "Value Added Tax" },
		FREELANCER: { deadline: "No fixed deadline", label: "Freelancer Tax" },
	};
