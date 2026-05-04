// =============================== USER UPLOAD SERVICE
// src/middlewares/userUpload.service.ts

// ===============================
import cloudinary from "../config/cloudinary.js";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// ===============================
export const uploadImage = async (
	fileBuffer: Buffer,
): Promise<UploadApiResponse> => {
	return new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream(
			{ folder: "taxlator" },
			(
				error: UploadApiErrorResponse | undefined,
				result: UploadApiResponse | undefined,
			) => {
				if (error) return reject(error);
				if (!result) return reject(new Error("Upload failed"));
				resolve(result);
			},
		);
		stream.end(fileBuffer);
	});
};