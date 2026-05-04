// =============================== PASSWORD RESET TOKEN MODEL
// src/models/PasswordRestToken.ts

// ===============================
import mongoose from "mongoose";

// ===============================
const resetTokenSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		token: {
			type: String,
			required: true,
			unique: true,
		},
		expiresAt: {
			type: Date,
			required: true,
			index: { expires: 0 }, 
		},
		used: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

export default mongoose.model("PasswordResetToken", resetTokenSchema);