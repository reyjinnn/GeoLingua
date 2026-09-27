export interface ApiSuccess<T> { success: true; data: T; meta?: { timestamp?: string } }
export interface ApiFailure { success: false; error: { code: string; message: string; details?: Record<string, string> | string[] | unknown } }
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure
