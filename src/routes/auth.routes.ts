// =============================== ROUTES AUTH
// src/routes/auth.routes.ts
// ===============================
import { Router, Request, Response } from "express";

import {
	register,
	login,
	forgotPassword,
	resetPasswordController,
	checkEmail,
	logout,
} from "../controllers/auth.controller.js";

// ===============================
const router = Router();

// =============================== REGISTER
router.post("/register", register);

// =============================== LOGIN
router.post("/login", login);

// =============================== FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// =============================== RESET PASSWORD
router.post("/reset-password", resetPasswordController);

// =============================== CHECK EMAIL EXISTS
router.get("/check-email", checkEmail);

// =============================== LOGOUT
router.post("/logout", logout);

// =============================== ROUTE TEST
router.get("/test", (req: Request, res: Response) => {
	res.json({
		message: "Auth route working ✅",
	});
});

export default router;
