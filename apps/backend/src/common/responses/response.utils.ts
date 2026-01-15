import { HttpStatus } from '@nestjs/common';

export interface ApiResponse<T> {
  statusCode: HttpStatus;
  message?: string;
  data: T;
}

export function createResponse<T>(
  data: T,
  statusCode: HttpStatus = HttpStatus.OK,
  message?: string,
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    statusCode,
    data,
  };

  if (message) {
    response.message = message;
  }

  return response;
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return createResponse(data, HttpStatus.OK, message);
}

export function createdResponse<T>(data: T, message?: string): ApiResponse<T> {
  return createResponse(data, HttpStatus.CREATED, message);
}
