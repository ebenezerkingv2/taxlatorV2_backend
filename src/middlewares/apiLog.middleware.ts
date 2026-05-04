// =============================== API LOG MIDDLEWARE + SOCKET
// src/middlewares/apiLog.middleware.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import { createApiLog } from "../services/apiLog.service.js";
import { getIO } from "../socket/index.js";

// ===============================
export const apiMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const start = Date.now();

	// ============================== CAPTURE RESPONSE BODY SAFELY
	let responseBody: any;

	const originalJson = res.json;
	res.json = function (body: any) {
		responseBody = body;
		return originalJson.call(this, body);
	};

	// =============================== AFTER RESPONSE FINISHES
	res.on("finish", () => {
		const skipPaths = ["/api/health", "/favicon.ico"];

		if (skipPaths.some((path) => req.originalUrl.startsWith(path))) {
			return;
		}

		const durationMs = Date.now() - start;
		const statusCode = res.statusCode;

		const logPayload = {
			userId: (req as any).user?.id,
			requestId: (req as any).requestId,
			method: req.method,
			path: req.originalUrl,
			statusCode,
			durationMs,
			input: req.body,
			output: responseBody,
			error: statusCode >= 400 ? responseBody : undefined,
		};

		// =============================== SAVE TO DB
		createApiLog(logPayload).catch(console.error);

		// =============================== REAL-TIME STREAM
		try {
			const io = getIO();

			io.emit("api:log", {
				method: req.method,
				path: req.originalUrl,
				statusCode,
				durationMs,
				timestamp: new Date(),
			});
		} catch {
			// socket not initialized — ignore
		}
	});

	next();
};
