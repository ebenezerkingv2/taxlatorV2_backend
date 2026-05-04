// =============================== API LOG SERVICE
// src/services/apiLog.service.ts

// ===============================
import ApiLog from "../models/ApiLog.js";

// ===============================
type CreateLogInput = {
	userId?: string;
	requestId: string;
	method: string;
	path: string;
	statusCode: number;
	durationMs: number;
	input?: any;
	output?: any;
	error?: any;
};

// ===============================
export async function createApiLog(data: CreateLogInput) {
	return ApiLog.create(data);
}