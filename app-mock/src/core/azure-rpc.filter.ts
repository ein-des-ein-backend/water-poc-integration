import { ArgumentsHost, ExceptionFilter, Catch } from '@nestjs/common';
import { AzureRpcException } from "./azure-rpc.exception";
import { AzureServiceBusContext } from './azure-service-bus.context';
import { BusinessValidationException } from './business-validation.exception';

@Catch(AzureRpcException, BusinessValidationException)
export class AzureRpcExceptionFilter implements ExceptionFilter {
  async catch(exception: AzureRpcException, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const azureContext: AzureServiceBusContext = ctx.getContext();
    const message = azureContext.getMessage();
    message.body = {
      data: message.body,
      errors: exception.errors
    }
    await message.deadLetter({ deadLetterErrorDescription: 'Validation failed', deadletterReason: 'Validation failed' });
    console.log(`Message is sent to Dead-Letter-Queue: Label: "${message.label}"; Body: ${JSON.stringify(message.body)}`);
  }
}
