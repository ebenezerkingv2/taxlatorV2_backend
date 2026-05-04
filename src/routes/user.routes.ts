// =============================== ROUTES USER
// src/routes/user.routes.ts
// ===============================
import { Router, Request, Response } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getTaxHistoryController } from "../controllers/taxHistory.controller.js";

import {
	getProfile,
	updateProfile,
	updatePassword,
} from "../controllers/user.controller.js";

import { userUpload } from "../middlewares/userUpload.middleware.js";

// ===============================
const router = Router();

// =============================== ME
router.get("/me", authMiddleware, getProfile);

// =============================== PROFILE
router.get("/profile", authMiddleware, getProfile);

// =============================== UPDATE PROFILE
router.patch("/profile", authMiddleware, updateProfile);

// =============================== PASSWORD CHANGE
router.patch("/password", authMiddleware, updatePassword);

// =============================== IMAGE UPLOAD
router.post(
	"/upload-avatar",
	authMiddleware,
	userUpload.single("image"),
	async (req: Request, res: Response) => {
		const file = req.file;

		res.json({
			message: "Upload endpoint ready",
			file: file?.originalname,
		});
	},
);

// =============================== TAX HISTORY
router.get("/history", authMiddleware, getTaxHistoryController);

export default router;
