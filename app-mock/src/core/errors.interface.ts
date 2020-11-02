import { ErrorType, ResponseErrorCode, ValidationErrorCode } from './enums';

interface ErrorResponse {
  statusCode: number;
  path: string;
  timestamp: string;
  errorType: ErrorType;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationErrors;
}

export interface GeneralErrorResponse extends ErrorResponse {
  error: ResponseErrorCode;
}

export interface IValidationErrorItemWithCode {
  field: string;
  messageCode: ValidationErrorCode;
}

export interface IValidationErrorItemWithoutCode {
  field: string;
  message: string;
}

export type ValidationErrors = Array<IValidationErrorItemWithCode | IValidationErrorItemWithoutCode>;
export type ResponseWithError = GeneralErrorResponse | ValidationErrorResponse;