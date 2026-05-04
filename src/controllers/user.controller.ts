// =============================== USER CONTROLLER
// src/routes/user.controller.ts

// ===============================
import type { Request, Response, NextFunction } from "express";
import {
	getUserProfile,
	updateUserProfile,
	changePassword,
} from "../services/user.service.js";
import { sendSuccess } from "../utils/response.js";

// =============================== GET PROFILE
export const getProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = (req as any).user.id;

		const user = await getUserProfile(userId);

		return sendSuccess(res, user);
	} catch (error) {
		next(error);
	}
};

// =============================== UPDATE PROFILE
export const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = (req as any).user.id;

		const updated = await updateUserProfile(userId, req.body);

		return sendSuccess(res, updated, "Profile updated");
	} catch (error) {
		next(error);
	}
};

// =============================== CHANGE PASSWORD
export const updatePassword = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const userId = (req as any).user.id;
		const { oldPassword, newPassword } = req.body;

		await changePassword(userId, oldPassword, newPassword);

		return sendSuccess(res, null, "Password updated");
	} catch (error) {
		next(error);
	}
};
