import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
  } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ValidationErrors } from './errors.interface';
import { ValidationErrorCode } from './enums';
import { ServiceBusMessage } from '@azure/service-bus';
import { RpcException } from '@nestjs/microservices';
import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';
import { AzureRpcException } from './azure-rpc.exception';
  // import { isValueInEnum } from './utils';
  
  const types = [String, Boolean, Number, Array, Object];
  
  @Injectable()
  export class MessagingValidationPipe implements PipeTransform<any> {
    async transform(value: object, metadata: ArgumentMetadata): Promise<any> {
    
      const { metatype } = metadata;
      if (!metatype || !this.toValidate(metatype)) {
        return;
      }
      const object = plainToClass(metatype, value);
      const errors = await validate(object, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });
      if (errors.length > 0) {
        const errorMsgs = this.mapError(errors);
        throw new AzureRpcException(errorMsgs);
      }
      return value;
    }
  
    private toValidate(metatype: any): boolean {
      return !types.find(type => metatype === type);
    }
  
    private mapError(errors: ValidationError[]): ValidationErrors {
      return errors.reduce((res: ValidationErrors, error: ValidationError) => {
        Object.keys(error.constraints).map((key: string) => {
          if (error.constraints.hasOwnProperty('whitelistValidation')) {
            res.push({
              field: error.property,
              messageCode: ValidationErrorCode.UNKNOWN_PROPERTY,
            });
          } else {
            // if (isValueInEnum(error.constraints[key], ValidationErrorCode)) {
            //   res.push({
            //     field: error.property,
            //     messageCode: error.constraints[key] as ValidationErrorCode,
            //   });
            // } else {
              res.push({
                field: error.property,
                message: error.constraints[key],
              });
            // }
          }
        });
        return res;
      }, []);
    }
  }