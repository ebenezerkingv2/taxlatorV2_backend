// =============================== REQUEST MIDDLEWARE
// src/middlewares/request.middleware.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

// ===============================
export const requestMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	// ================= REQUEST ID
	const requestId = (req.headers["x-request-id"] as string) || randomUUID();

	// ================= START TIMER
	const startTime = Date.now();

	// ================= ATTACH TO REQUEST
	(req as any).requestId = requestId;
	(req as any).startTime = startTime;

	// ================= RESPONSE HEADER
	res.setHeader("x-request-id", requestId);

	// ================= LOG AFTER RESPONSE FINISH
	res.on("finish", () => {
		const duration = Date.now() - startTime;

		console.log("📡 REQUEST TRACE", {
			requestId,
			method: req.method,
			path: req.originalUrl,
			status: res.statusCode,
			duration: `${duration}ms`,
			userId: (req as any).user?.id || null,
			ip: req.ip,
		});
	});

	next();
};
