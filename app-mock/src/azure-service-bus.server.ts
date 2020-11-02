import { ServiceBusClient, ReceiveMode, QueueClient, Receiver, ServiceBusMessage, Sender } from '@azure/service-bus';
import { Server, CustomTransportStrategy, RmqContext } from '@nestjs/microservices';
import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';
import { Observable } from 'rxjs';
import { AzureServiceBusContext } from './core/azure-service-bus.context';

export class AzureServiceBusServer extends Server implements CustomTransportStrategy {
    private sbClient: ServiceBusClient;
    private queueClient: QueueClient;
    private receiver: Receiver;
    private sender: Sender;
    private 

    constructor(
      private readonly connectionString: string,
      private readonly queue: string) {
        super();
      }

  public async listen(callback: () => void) {
    await this.init();
    this.receiver.registerMessageHandler(this.handleMessage.bind(this), (error: Error) => {
        console.log(error);
    }, { autoComplete: false });
  }

  public close() {
      this.queueClient && this.queueClient.close();
      this.sbClient && this.sbClient.close();
  }

  private async handleMessage(message: ServiceBusMessage) {
    const { body, label } = message;
    const handler = this.getHandlerByPattern(label);
    if (!handler) {
      return;
    }
    this.handleEvent(label, { pattern: label, data: message.body }, new AzureServiceBusContext(message, this.receiver, this.sender, this.sbClient));
    // const response$ = this.transformToObservable(await handler(message.body, message)) as Observable<any>;
    // response$ && this.send(response$, (data) => this.sendMessage(label, data));
    console.log(`Received message from [SAP]: Label: "${label}"; Body: ${JSON.stringify(body)}`);
  }

  private sendMessage(label: string, message: any) {
    this.sender.send({
        body: JSON.stringify(message),
        contentType: 'application/json',
        label: `[REPLY]${label}`,
        userProperties: { type: 'Some time' }
    });
  }

  private async init() {
    this.sbClient = ServiceBusClient.createFromConnectionString(this.connectionString);
    this.queueClient = this.sbClient.createQueueClient(this.queue);
    this.receiver = this.queueClient.createReceiver(ReceiveMode.peekLock);
    this.sender = this.queueClient.createSender();
  }
}