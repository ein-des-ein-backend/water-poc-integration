import { ValidationErrorCode } from '../enums/validation-error-code.enum';

export interface IValidationErrorItemWithCode {
  field: string;
  messageCode: ValidationErrorCode;
}

export interface IValidationErrorItemWithoutCode {
  field: string;
  message: string;
}

export type ValidationErrors = Array<IValidationErrorItemWithCode | IValidationErrorItemWithoutCode>;