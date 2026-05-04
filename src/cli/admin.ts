// ===============================
// src/cli/admin.ts
// =============================== ADMIN CLI
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { hashPassword } from "../utils/hash.js";

// ===============================
dotenv.config();

// ===============================
const run = async () => {
	const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

	if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
		console.error("❌ Missing required env variables");
		process.exit(1);
	}

	await mongoose.connect(MONGO_URI);

	// ===============================
	const existing = await User.findOne({ email: ADMIN_EMAIL });

	if (!existing) {
		const hashedPassword = await hashPassword(ADMIN_PASSWORD);

		await User.create({
			name: ADMIN_NAME ?? "Super Admin",
			email: ADMIN_EMAIL,
			password: hashedPassword,
			role: "ADMIN",
		});

		console.log("✅ Admin created successfully");
	} else {
		await User.updateOne({ email: ADMIN_EMAIL }, { $set: { role: "ADMIN" } });

		console.log("⚡ Existing user promoted to ADMIN");
	}

	await mongoose.disconnect();
	process.exit(0);
};

run().catch((err) => {
	console.error("❌ CLI failed:", err);
	process.exit(1);
});
