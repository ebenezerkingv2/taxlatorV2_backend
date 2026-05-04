// =============================== TAX RECORD MODEL
// src/models/TaxRecord.ts

// ===============================
import mongoose, { Document, Schema } from "mongoose";

// ===============================
export interface ITaxRecord extends Document {
	userId: mongoose.Types.ObjectId;
	taxType: string;
	inputSnapshot: Record<string, any>;
	outputSnapshot: Record<string, any>;
	annualTax?: number;
	monthlyTax?: number;
	createdAt?: Date;
}

// ===============================
const taxRecordSchema = new Schema<ITaxRecord>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},

		taxType: {
			type: String,
			required: true,
			enum: ["PAYE", "FREELANCER", "CIT", "VAT"],
			index: true,
		},

		inputSnapshot: {
			type: Object,
			required: true,
		},

		outputSnapshot: {
			type: Object,
			required: true,
		},

		annualTax: Number,
		monthlyTax: Number,
	},
	{ timestamps: true },
);

// =============================== INDEXING (CRITICAL)
taxRecordSchema.index({ userId: 1, createdAt: -1 });
taxRecordSchema.index({ userId: 1, taxType: 1, createdAt: -1 });

export default mongoose.model<ITaxRecord>("TaxRecord", taxRecordSchema);
