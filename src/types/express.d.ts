// =============================== EXPRESS TYPES
// src/types/express.d.ts

// ===============================
import "express";

// ===============================
declare module "express-serve-static-core" {
	interface Request {
		user?: {
			id: string;
			role: "USER" | "ADMIN";
		};

		file?: Express.Multer.File;
		files?: Express.Multer.File[];
	}
}
