import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AzureServiceBusServer } from './core/azure/azure-service-bus.server';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    strategy: new AzureServiceBusServer(
      'Endpoint=sb://adja-water.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=B1njmeyo66cI5atStu0lWBN+YVT0bxngZgkk+/T+iYk=',
      'sap-app-queue'
    )
  });
  app.startAllMicroservicesAsync();
  // app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000, () => console.log('Server is running'));
}
bootstrap();
