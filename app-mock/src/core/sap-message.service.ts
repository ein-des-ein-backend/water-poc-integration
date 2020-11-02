import { Injectable } from "@nestjs/common";
import { ClientProxy } from '@nestjs/microservices';
import { AzureServiceBusClient } from '../azure-service-bus.client';
import { AppEvents } from "./app-events.enum";

@Injectable()
export class SapMessageService {

    private readonly client: ClientProxy = new AzureServiceBusClient(
        'Endpoint=sb://adja-water.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=B1njmeyo66cI5atStu0lWBN+YVT0bxngZgkk+/T+iYk=',
        'app-sap-queue'
    );

    public publishEvent(eventName: AppEvents, data: any): void {
        this.client.emit(eventName, data);
        console.log(`Publishing message to [SAP]: Label: "${eventName}"; Body: ${JSON.stringify(data)}`);
    }

}