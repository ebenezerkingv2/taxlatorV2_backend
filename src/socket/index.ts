// =============================== SOCKET INDEX LIVE UPDATES
// src/socket/index.ts

// ===============================
import { Server } from "socket.io";

// ===============================
let io: Server;

// ===============================
export const initSocket = (server: any) => {
	io = new Server(server, {
		cors: {
			origin: "*",
		},
	});

	// =============================== ADMIN CONNECTION
	io.on("connection", (socket) => {
		console.log("🟢 Admin connected:", socket.id);

		// =============================== USER AUTH ROOM JOIN
		socket.on("auth:join", (userId: string) => {
			socket.join(userId);
			console.log(`👤 User joined room: ${userId}`);
		});

		// =============================== DISCONNECT
		socket.on("disconnect", () => {
			console.log("🔴 Disconnected:", socket.id);
		});
	});
};

// ===============================
export const getIO = () => {
	if (!io) {
		throw new Error("Socket not initialized");
	}
	return io;
};
