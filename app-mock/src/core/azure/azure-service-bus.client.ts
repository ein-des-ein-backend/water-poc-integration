import { ServiceBusClient, ReceiveMode, QueueClient, Receiver, ServiceBusMessage, Sender } from '@azure/service-bus';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { v4 } from 'uuid';
import { EventEmitter } from 'events';

export class AzureServiceBusClient extends ClientProxy {
    private sbClient: ServiceBusClient;
    private queueClient: QueueClient;
    private receiver: Receiver;
    private sender: Sender;
    private responseEmitter: EventEmitter = new EventEmitter();

    constructor(
        private readonly connectionString: string,
        private readonly queue: string
    ) {
        super();
    }

  protected publish(packet: ReadPacket, callback: (packet: WritePacket) => void): Function {
    try {
        const correlationId: string = v4();
        const listener: (...args: any[]) => void = ([message]) => this.handleMessage(message, callback);
        this.responseEmitter.addListener(correlationId, listener);
        this.sender.send({
            body: JSON.stringify({ ...packet.data, correlationId }),
            contentType: 'application/json',
            label: JSON.stringify(packet.pattern)
        });
        return () => this.responseEmitter.removeListener(correlationId, listener);

    } catch (err) {
        callback({ err });
    }
  }

  protected async dispatchEvent<Void>(packet: ReadPacket): Promise<Void> {
    try {
      await this.sender.send({
            body: JSON.stringify(packet.data),
            contentType: 'application/json',
            label: JSON.stringify(packet.pattern)
      });
    } catch (err) {
        console.log(err);
        return err;
    }
  }

  private handleMessage(message, callback: (err, result, disposed?: boolean) => void) {
    const { content } = message;
    const { err, response, disposed } = JSON.parse(content.toString());
    callback(err, response, disposed);
  }

  public connect(): Promise<any> {
    this.sbClient = ServiceBusClient.createFromConnectionString(this.connectionString);
    this.queueClient = this.sbClient.createQueueClient(this.queue);
    this.receiver = this.queueClient.createReceiver(ReceiveMode.peekLock);
    this.sender = this.queueClient.createSender();
    return Promise.resolve();
  }

  public close(): void {
      this.sbClient && this.sbClient.close();
      this.queueClient && this.queueClient.close();
      this.receiver && this.receiver.close();
      this.sender && this.sender.close();
  }

}