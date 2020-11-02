import { RpcException } from "@nestjs/microservices";
import { ValidationErrors } from './errors.interface';

export class AzureRpcException extends RpcException {
    ;
    constructor(
        public readonly errors: ValidationErrors
        
    ) {
        super('Validation error');
    }
}