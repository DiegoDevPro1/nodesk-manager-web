export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  status: string;
  error?: string;
  errors?: Record<string, string | string[]>;
  path?: string;
  timestamp: string;
}
