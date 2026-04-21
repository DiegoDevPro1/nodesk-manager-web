export type ApiResponseStatus = 'success' | 'error' | 'fail';

export interface ApiResponse<TData> {
  statusCode: number;
  message: string;
  status: ApiResponseStatus;
  data: TData;
  timestamp: string;
}
