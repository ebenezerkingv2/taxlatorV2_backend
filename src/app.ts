// =============================== APP
// src/app.ts

// ===============================
import express from "express";
import cors from "cors";
import corsOptions from "./config/cors.config.js";
import helmet from "helmet";
import morgan from "morgan";

import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { requestMiddleware } from "./middlewares/request.middleware.js";
import { apiMiddleware } from "./middlewares/apiLog.middleware.js";

// =============================== CREATE APP FIRST
const app = express();

// =============================== CORS 
app.use(cors(corsOptions));


// =============================== CORE MIDDLEWARE
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// =============================== REQUEST CONTEXT
app.use(requestMiddleware);

// =============================== API LOGGING
app.use(apiMiddleware);

// =============================== ROUTES
app.use("/api", routes);

// =============================== ERROR HANDLER
app.use(errorMiddleware);

export default app;
