// =============================== HEALTH CONTROLLER
// src/controllers/health.controller.ts

// ===============================
import type { Request, Response } from "express";
import mongoose from "mongoose";

// ===============================
export const healthController = (req: Request, res: Response) => {
	const memory = process.memoryUsage();

	return res.status(200).json({
		status: "ok",
		uptime: process.uptime(),
		timestamp: new Date().toISOString(),
		environment: process.env.NODE_ENV || "development",
		database:
			mongoose.connection.readyState === 1 ? "connected" : "disconnected",
		memory: {
			rss: memory.rss,
			heapTotal: memory.heapTotal,
			heapUsed: memory.heapUsed,
		},
	});
};
