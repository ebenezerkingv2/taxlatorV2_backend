// =============================== AUTH CONTROLLER = REGISTER, LOGIN, FORGOT, RESET PASSWORD + SOCKET + REFRESH TOKEN
// src/controllers/auth.controller.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import {
	registerUser,
	loginUser,
	createResetToken,
	resetPassword,
} from "../services/auth.service.js";

import { sendSuccess } from "../utils/response.js";
import { getIO } from "../socket/index.js";
import { logoutUser } from "../services/auth.service.js";
import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

// =============================== REGISTER
export const register = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { name, email, password } = req.body;

		const { user, token } = await registerUser(name, email, password);

		getIO().emit("user:activity", {
			type: "REGISTER",
			userId: user.id,
			email: user.email,
			timestamp: new Date(),
		});

		return sendSuccess(res, { user, token }, "User registered", 201);
	} catch (err) {
		next(err);
	}
};

// =============================== LOGIN
export const login = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email, password } = req.body;

		const result = await loginUser(email, password);

		getIO().emit("user:activity", {
			type: "LOGIN",
			userId: result.user.id,
			email: result.user.email,
			timestamp: new Date(),
		});

		return sendSuccess(res, result, "Login successful");
	} catch (err) {
		next(err);
	}
};

// =============================== REFRESH TOKEN
export const refreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { refreshToken } = req.body;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		// =============================== VERIFY REFRESH TOKEN
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_SECRET as string,
		) as { id: string };

		// =============================== FIND USER
		const user = await User.findById(decoded.id);

		if (!user) {
			return res.status(401).json({ message: "Invalid session" });
		}

		// =============================== CHECK TOKEN EXISTS IN DB
		const tokenExists = user.refreshTokens?.some(
			(t: any) => t.token === refreshToken,
		);

		if (!tokenExists) {
			return res.status(401).json({ message: "Session expired" });
		}

		// =============================== GENERATE NEW ACCESS TOKEN (FIXED)
		const newAccessToken = generateToken({
			id: user.id,
			role: user.role,
			tokenVersion: user.tokenVersion,
		});

		return res.json({
			token: newAccessToken,
		});
	} catch (err) {
		next(err);
	}
};

// =============================== FORGOT PASSWORD
export const forgotPassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { email } = req.body;

		const token = await createResetToken(email);

		return sendSuccess(
			res,
			{ token },
			"Reset token created (send via email in production)",
		);
	} catch (err) {
		next(err);
	}
};

// =============================== RESET PASSWORD
export const resetPasswordController = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { token, newPassword } = req.body;

		await resetPassword(token, newPassword);

		return sendSuccess(res, null, "Password reset successful");
	} catch (err) {
		next(err);
	}
};

// =============================== CHECK EMAIL
export const checkEmail = async (req: Request, res: Response) => {
	try {
		const { email } = req.query;

		if (!email || typeof email !== "string") {
			return res.status(400).json({
				success: false,
				message: "Email is required",
			});
		}

		const user = await User.findOne({ email });

		return res.json({
			success: true,
			exists: !!user,
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success: false,
			message: "Server error",
		});
	}
};

// =============================== LOGOUT (TOKEN VERSION SYSTEM)
export const logout = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = (req as any).user?.id;

		await logoutUser(userId);

		// =============================== LIVE LOGOUT TO ALL DEVICES
		getIO().to(userId).emit("auth:logout");

		return res.status(200).json({
			success: true,
			message: "Logged out successfully",
		});
	} catch (err) {
		next(err);
	}
};
