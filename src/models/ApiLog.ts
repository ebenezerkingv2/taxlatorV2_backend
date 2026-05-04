// =============================== API LOG MODEL
// src/models/ApiLog.ts

// ===============================
import mongoose, { Schema, Document, Types } from "mongoose";

// ===============================
export interface IApiLog extends Document {
	userId?: Types.ObjectId;
	requestId: string;
	method: string;
	path: string;
	statusCode: number;
	durationMs: number;
	input?: unknown;
	output?: unknown;
	error?: unknown;
	createdAt?: Date;
}

// ===============================
const apiLogSchema = new Schema<IApiLog>(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			index: true,
		},

		requestId: {
			type: String,
			required: true,
			index: true,
		},

		method: {
			type: String,
			required: true,
			index: true,
		},
		path: {
			type: String,
			required: true,
			index: true,
		},

		statusCode: {
			type: Number,
			index: true,
		},

		durationMs: Number,

		input: Schema.Types.Mixed,
		output: Schema.Types.Mixed,
		error: Schema.Types.Mixed,
	},
	{ timestamps: true },
);

// ================= INDEXES FOR ADMIN DASHBOARD
apiLogSchema.index({ createdAt: -1 });
apiLogSchema.index({ userId: 1, createdAt: -1 });
apiLogSchema.index({ statusCode: 1, createdAt: -1 });
apiLogSchema.index({ path: 1, createdAt: -1 });
apiLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export default mongoose.model<IApiLog>("ApiLog", apiLogSchema);
