// =============================== ROLE ID PASSWORD
// src/utils/id.ts

// ===============================
import mongoose from "mongoose";

// ===============================
export const toId = (id: mongoose.Types.ObjectId | string) => {
	return id.toString();
};