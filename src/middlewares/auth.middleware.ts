// =============================== AUTH MIDDLEWARE
// src/middlewares/auth.middleware.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			const error = new Error("No token provided");
			(error as any).statusCode = 401;
			throw error;
		}

		const token = authHeader.split(" ")[1];

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: string;
			role: "USER" | "ADMIN";
			tokenVersion: number;
		};

		// =============================== FETCH USER
		const user = await User.findById(decoded.id);

		if (!user) {
			const error = new Error("User not found");
			(error as any).statusCode = 401;
			throw error;
		}

		// =============================== JWT TOKEN VERSION CHECK (KEY PART)
		if (user.tokenVersion !== decoded.tokenVersion) {
			const error = new Error("Session expired. Please login again.");
			(error as any).statusCode = 401;
			throw error;
		}

		(req as any).user = {
			id: decoded.id,
			role: decoded.role,
		};

		next();
	} catch (error: any) {
		if (error.name === "TokenExpiredError") {
			error.statusCode = 401;
			error.message = "Token expired";
		}

		if (error.name === "JsonWebTokenError") {
			error.statusCode = 401;
			error.message = "Invalid token";
		}

		next(error);
	}
};
