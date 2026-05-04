// =============================== TAX DTO ZOD SCHEMA
// src/tax/schema/tax.schema.ts

// ===============================
import { z } from "zod";
import { TAX_TYPES } from "../../tax/constants/tax.constant.js";

// =============================== COMMON
const baseSchema = z.object({
	save: z.boolean().optional(),
});

// =============================== PAYE/PIT
export const payeSchema = baseSchema.extend({
	taxType: z.literal(TAX_TYPES.PAYE),
	data: z.object({
		grossAnnualIncome: z.number().min(0),
		otherDeductions: z.number().min(0).optional(),
		nationalHealthInsuranceScheme: z.boolean().optional(),
		nationalHousingFund: z.boolean().optional(),
		payePensionContribution: z.boolean().optional(),
		rent: z.boolean().optional(),
	}),
});

// =============================== FREELANCER
export const freelancerSchema = baseSchema.extend({
	taxType: z.literal(TAX_TYPES.FREELANCER),
	data: z.object({
		grossAnnualIncome: z.number().min(0),
		totalBusinessExpenses: z.number().min(0).optional(),
		pensionContribution: z.number().min(0).optional(),
	}),
});

// =============================== CIT
export const citSchema = baseSchema.extend({
	taxType: z.literal(TAX_TYPES.CIT),
	data: z.object({
		annualTurnover: z.number().min(0),
		taxableProfit: z.number().min(0),
		fixedAssets: z.number().min(0).optional(),
		accountingProfit: z.number().min(0).optional(),
		companySize: z.enum(["SMALL", "OTHER", "MULTINATIONAL"]).optional(),
		isMultinational: z.boolean().optional(),
		citRate: z.number().min(0).max(1).optional(),
	}),
});

// =============================== VAT
export const vatSchema = baseSchema.extend({
	taxType: z.literal(TAX_TYPES.VAT),
	data: z.object({
		transactionAmount: z.number().min(0),
		calculationType: z.enum(["ADD", "REMOVE"]),
		transactionType: z.enum(["DOMESTIC", "DIGITAL", "EXPORT", "EXEMPT"]),
	}),
});

// =============================== UNION
export const taxSchema = z.discriminatedUnion("taxType", [
	payeSchema,
	freelancerSchema,
	citSchema,
	vatSchema,
]);

export type TaxZodInput = z.infer<typeof taxSchema>;
