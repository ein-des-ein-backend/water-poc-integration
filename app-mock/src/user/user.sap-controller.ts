import { Controller, UseFilters } from "@nestjs/common";
import { ServiceBusMessage } from '@azure/service-bus';
import { UserService } from './user.service';
import { MessagePattern, Payload, Ctx } from '@nestjs/microservices';
import { SapEvents } from '../core/enums/sap-events.enum';
import { SapUserDto } from "./dto/sap-user.dto";
import { MessagingValidationPipe } from "../core/pipes/messaging-validation.pipe";
import { AzureRpcExceptionFilter } from "../core/azure/azure-rpc.filter";
import { AzureServiceBusContext } from "../core/azure/azure-service-bus.context";
import { BusinessValidationException } from "../core/exceptions/business-validation.exception";

@Controller()
export class UserSapController {

    constructor(
        private readonly userService: UserService,
    ) {}

    @MessagePattern(SapEvents.CREATED_USER)
    @UseFilters(new AzureRpcExceptionFilter())
    public async createOne(@Payload(new MessagingValidationPipe()) payload: SapUserDto, @Ctx() context: AzureServiceBusContext): Promise<void> {
        const message: ServiceBusMessage = context.getMessage();
        try {
            await this.userService.createOneFromSap(payload);
            message.complete();
            console.log(`Completed processing message from [SAP]: Label: "${message.label}"; Body: ${JSON.stringify(message.body)}`);
        } catch (err) {
            console.log(err);
            if (err instanceof BusinessValidationException) {
                message.body = {
                    data: message.body,
                    errors: err.errors
                }
                await message.deadLetter({ deadLetterErrorDescription: 'Validation failed', deadletterReason: 'Validation failed' });
                console.log(`Message is sent to Dead-Letter-Queue: Label: "${message.label}"; Body: ${JSON.stringify(message.body)}`);
            } else {
                message.abandon();
            }
        }
    }

    @MessagePattern(SapEvents.UPDATED_USER)
    @UseFilters(new AzureRpcExceptionFilter())
    public async updateOne(@Payload(new MessagingValidationPipe()) payload: SapUserDto, @Ctx() context: AzureServiceBusContext): Promise<void> {
        const message: ServiceBusMessage = context.getMessage();
        try {
            await this.userService.updateOneFromSap(payload);
            message.complete();
            console.log(`Completed processing message from [SAP]: Label: "${message.label}"; Body: ${JSON.stringify(message.body)}`);
        } catch (err) {
            console.log(err);
            if (err instanceof BusinessValidationException) {
                message.body = {
                    data: message.body,
                    errors: err.errors
                }
                await message.deadLetter({ deadLetterErrorDescription: 'Validation failed', deadletterReason: 'Validation failed' });
                console.log(`Message is sent to Dead-Letter-Queue: Label: "${message.label}"; Body: ${JSON.stringify(message.body)}`);
            } else {
                message.abandon();
            }        }
    }

    @MessagePattern(SapEvents.DELETED_USER)
    @UseFilters(new AzureRpcExceptionFilter())
    public async removeOne(@Payload(new MessagingValidationPipe()) payload: SapUserDto, @Ctx() context: AzureServiceBusContext): Promise<void> {
        const message: ServiceBusMessage = context.getMessage();
        try {
            await this.userService.removeOneFromSap(payload.integrationId);
            message.complete();
            console.log(`Completed processing message from [SAP]: Label: "${message.label}"; Body: ${JSON.stringify(message.body)}`);
        } catch (err) {
            console.log(err);
            if (err instanceof BusinessValidationException) {
                message.body = {
                    data: message.body,
                    errors: err.errors
                }
                await message.deadLetter({ deadLetterErrorDescription: 'Validation failed', deadletterReason: 'Validation failed' });
                console.log(`Message is sent to Dead-Letter-Queue: Label: "${message.label}"; Body: ${JSON.stringify(message.body)}`);
            } else {
                message.abandon();
            }
        }
    }
}