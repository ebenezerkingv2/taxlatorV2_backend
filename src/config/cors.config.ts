// =============================== CORS CONFIG
// CORS = R
// ===============================
import type { CorsOptions } from "cors";
import { env } from "./env.js";

// ===============================
const allowedOrigins = env.ALLOWED_ORIGINS.split(",").map((origin) =>
	origin.trim(),
);

// ===============================
const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error("Not allowed by CORS"));
	},
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
	optionsSuccessStatus: 200,
};

export default corsOptions;
