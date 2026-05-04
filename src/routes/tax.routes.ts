// =============================== ROUTES TAX
// src/routes/tax.routes.ts

// ===============================
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import { calculateTaxController } from "../controllers/tax.controller.js";
import { calculateAndSaveTaxController } from "../controllers/taxSave.controller.js";

import { getTaxHistoryController } from "../controllers/taxHistory.controller.js";

// ===============================
const router = Router();

// ================= PUBLIC =
router.post("/calculate", calculateTaxController);

// ================= PRIVATE (SAVE) =
router.post("/calculate/save", authMiddleware, calculateAndSaveTaxController);

// ================= HISTORY =
router.get("/history", authMiddleware, getTaxHistoryController);

export default router;
