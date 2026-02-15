// Simple API response wrapper used across controllers.
// Keeps response format consistent: { success, message, data }

export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
