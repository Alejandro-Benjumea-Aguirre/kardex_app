export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  error?: { code: string; message: string };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
