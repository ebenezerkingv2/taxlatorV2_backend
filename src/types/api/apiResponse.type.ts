// =============================== API RESPONSE TYPE
// src/types/apiResponse.type.ts

// ===============================
export type ApiMeta = {
	requestId: string;
	timestamp: string;
	saved?: boolean;
};

// ===============================
export type ApiResponse<T> = {
	success: boolean;
	message?: string;
	data: T;
	meta: ApiMeta;
	errors?: any;
};
