// =============================== CREATE JWT TOKEN
// UTILS = R

// ===============================
import jwt from "jsonwebtoken";

// ===============================
export const generateAccessToken = (payload: any) => {
	return jwt.sign(payload, process.env.JWT_SECRET as string, {
		expiresIn: "15m",
	});
};

// ===============================
export const generateRefreshToken = (payload: any) => {
	return jwt.sign(payload, process.env.REFRESH_SECRET as string, {
		expiresIn: "30d",
	});
};
