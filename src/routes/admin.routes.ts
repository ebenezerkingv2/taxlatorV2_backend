// =============================== ROUTES ADMIN
// src/routes/admin.routes.ts

// ===============================
import { Router } from "express";
import { adminDashboardController } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

// ===============================
const router = Router();

// ===============================
router.get(
	"/dashboard",
	authMiddleware,
	adminMiddleware,
	adminDashboardController,
);

export default router;
