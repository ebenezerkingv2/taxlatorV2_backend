// =============================== TYPES TAX INPUT
// src/types/taxInput.type.ts

// =============================== PAYE
export type PayeInput = {
	grossAnnualIncome: number;
	otherDeductions?: number;
	nationalHealthInsuranceScheme?: boolean;
	nationalHousingFund?: boolean;
	payePensionContribution?: boolean;
};

// =============================== FREELANCER
export type FreelancerInput = {
	grossAnnualIncome: number;
	totalBusinessExpenses?: number;
	pensionContribution?: number;
};

// =============================== CIT
export type CITInput = {
	annualTurnover: number;
	taxableProfit: number;
	fixedAssets?: number;
	accountingProfit?: number;
	companySize?: "SMALL" | "OTHER" | "MULTINATIONAL";
	isMultinational?: boolean;
	citRate?: number;
};

// =============================== VAT CALCULATION TYPE
export type CalculationType = "ADD" | "REMOVE";

// =============================== VAT TRANSACTION TYPE
export type TransactionType = "DOMESTIC" | "DIGITAL" | "EXPORT" | "EXEMPT";

// =============================== VAT
export type VATInput = {
	transactionAmount: number;
	calculationType: CalculationType;
	transactionType: TransactionType;
};

// =============================== STRICT MAP
export type TaxInputMap = {
	PAYE: PayeInput;
	FREELANCER: FreelancerInput;
	CIT: CITInput;
	VAT: VATInput;
};
