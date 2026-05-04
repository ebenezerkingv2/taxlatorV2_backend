// =============================== JWT
// src/utils/jwt.ts

// ===============================
import jwt from "jsonwebtoken";

// ===============================
export type JwtPayload = {
	id: string;
	role: "USER" | "ADMIN";
	tokenVersion: number;
};

// =============================== JWT TOKEN VERSION
export const generateToken = (payload: JwtPayload) => {
	return jwt.sign(payload, process.env.JWT_SECRET as string, {
		expiresIn: "7d",
	});
};
