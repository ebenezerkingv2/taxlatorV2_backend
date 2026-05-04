// ===============================
// packages/shared/src/utils/apiHelpers.ts
// ===============================
import type { ApiResponse } from "../types/api/apiResponse.type.js";

// ===============================
export const unwrapData = <T>(res: ApiResponse<T>) => res.data;

// ===============================
export const isSaved = <T>(res: ApiResponse<T>) => res.meta.saved;
