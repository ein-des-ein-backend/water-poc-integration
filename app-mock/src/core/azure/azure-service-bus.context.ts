import { Receiver, Sender, ServiceBusClient, ServiceBusMessage } from '@azure/service-bus';
import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';

export class AzureServiceBusContext extends BaseRpcContext {

    constructor(message: ServiceBusMessage, receiver: Receiver, sender: Sender, sbClient: ServiceBusClient) {
        super([message, receiver, sender, sbClient]);
    }

    public getMessage(): ServiceBusMessage {
        return this.getArgByIndex(0);
    }

    public getReceiver(): Receiver {
        return this.getArgByIndex(1);
    }

    public getSender(): Sender {
        return this.getArgByIndex(2);
    }

    public getSbClient(): ServiceBusClient {
        return this.getArgByIndex(3);
    }
}