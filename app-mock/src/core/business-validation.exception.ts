import { IValidationErrorItemWithoutCode } from './errors.interface';

export class BusinessValidationException {

    constructor(
        public errors: IValidationErrorItemWithoutCode[]
    ) {}

}