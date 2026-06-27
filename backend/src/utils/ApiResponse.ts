// Ensures every API response has the same shape:
// { success, message, data, meta }
// This makes frontend parsing predictable and consistent.

export class ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  meta?: Record<string, unknown>; // for pagination, counts, etc.

  constructor(
    success: boolean,
    message: string,
    data: T | null = null,
    meta?: Record<string, unknown>
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.meta = meta;
  }

  // Convenience static methods so controllers stay clean
  static success<T>(
    message: string,
    data: T | null = null,
    meta?: Record<string, unknown>
  ) {
    return new ApiResponse<T>(true, message, data, meta);
  }

  static error(message: string) {
    return new ApiResponse<null>(false, message, null);
  }
}