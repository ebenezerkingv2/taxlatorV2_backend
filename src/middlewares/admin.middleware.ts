// =============================== ADMIN GUARD MIDDLEWARE
// src/middlewares/admin.middleware.ts

// ===============================
import type { Request, Response, NextFunction } from "express";

// =============================== SIMPLE ROLE BASED GUARD (UPGRADE LATER TO RBAC)
export const adminMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const user = (req as any).user;

	if (!user || user.role !== "ADMIN") {
		return res.status(403).json({
			success: false,
			message: "Admin access required",
		});
	}

	next();
};