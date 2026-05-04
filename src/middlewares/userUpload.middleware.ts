// =============================== USER UPLOAD MIDDLEWARE
// src/middlewares/userUpload.middleware.ts

// ===============================
import multer from "multer";

// ===============================
export const userUpload = multer({
	storage: multer.memoryStorage(),
});
