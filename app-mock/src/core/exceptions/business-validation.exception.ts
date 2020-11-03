import { IValidationErrorItemWithoutCode } from '../interfaces/errors.interface';

export class BusinessValidationException {

    constructor(
        public errors: IValidationErrorItemWithoutCode[]
    ) {}

}