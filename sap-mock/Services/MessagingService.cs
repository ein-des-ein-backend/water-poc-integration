using System.Linq;
using System.ComponentModel.DataAnnotations;
using System;
using System.Threading.Tasks;
using System.Text;
using System.Threading;
using System.Collections.Generic;
using Microsoft.Azure.ServiceBus;
using Newtonsoft.Json;
using sap_mock.AppDtos;
using Microsoft.Extensions.Logging;
using sap_mock.Exceptions;

namespace sap_mock.Services {
    public class MessagingService {
        const string ServiceBusConnectionString = "Endpoint=sb://adja-water.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=B1njmeyo66cI5atStu0lWBN+YVT0bxngZgkk+/T+iYk=";
        const string QueueName = "sap-app-queue";
        const string IncomingQueueName = "app-sap-queue";
        private readonly UserService _userService;
        private readonly ILogger<MessagingService> _logger;
        IQueueClient queueClientToSend = new QueueClient(ServiceBusConnectionString, QueueName);
        IQueueClient queueClientToReceive = new QueueClient(ServiceBusConnectionString, IncomingQueueName);

        public MessagingService(UserService userService, ILogger<MessagingService> logger) {
            _userService = userService;
            _logger = logger;
            var messageHandlerOptions = new MessageHandlerOptions((ExceptionReceivedEventArgs exceptionReceivedEventArgs) => {
                var context = exceptionReceivedEventArgs.ExceptionReceivedContext;
                Console.WriteLine("Exception context for troubleshooting:");
                Console.WriteLine($"- Endpoint: {context.Endpoint}");
                Console.WriteLine($"- Entity Path: {context.EntityPath}");
                Console.WriteLine($"- Executing Action: {context.Action}");
                return Task.CompletedTask;
            }) {
                MaxConcurrentCalls = 1,
                AutoComplete = false
            };
            Console.WriteLine("Some code");
            queueClientToReceive.RegisterMessageHandler(ProcessMessagesAsync, messageHandlerOptions);
        }

        public async Task sendMessage(string label, string messageString) {
            var message = new Message(Encoding.UTF8.GetBytes(messageString));
            message.Label = label;
            await queueClientToSend.SendAsync(message);
            _logger.LogInformation($"Message is sent: Label: {message.Label}; Body: {messageString}");
        }
        public async Task ProcessMessagesAsync(Message message, CancellationToken token)
        {
            try {
                var userDto = JsonConvert.DeserializeAnonymousType<AppUserDto>(
                    JsonConvert.DeserializeObject(Encoding.UTF8.GetString(message.Body)).ToString(),
                    new AppUserDto()
                );
                _logger.LogInformation($"Message received: Label: {message.Label}; Body: {Encoding.UTF8.GetString(message.Body)}");
                var results = new List<ValidationResult>();
                var context = new ValidationContext(userDto);

                if (!Validator.TryValidateObject(userDto, context, results, true)) {
                    var validationErrors = new List<ValidationError>();

                    foreach(var res in results) {
                        validationErrors.Add(
                            new ValidationError(res.ErrorMessage, string.Join(",", res.MemberNames.ToArray()))
                        );
                    }

                    message.Body = Encoding.UTF8.GetBytes(
                        JsonConvert.SerializeObject(new { Data = userDto, Errors = validationErrors })
                    );
                    await queueClientToReceive.DeadLetterAsync(message.SystemProperties.LockToken, "Invalid schema", "Invalid schema");
                    _logger.LogInformation($"Message is sent to Dead-Letter-Queue: Label: {message.Label}; Body: {Encoding.UTF8.GetString(message.Body)}");
                } else {
                    switch (JsonConvert.DeserializeObject(message.Label)) {
                        case "[APP] Created user": {
                            await _userService.CreateUser(userDto);
                            break;
                        }
                        case "[APP] Updated user": {
                            await _userService.UpdateUser(userDto);
                            break;
                        }
                        case "[APP] Deleted user": {
                            await _userService.DeleteUser(userDto.IntegrationId);
                            break;
                        }
                    }
                    await queueClientToReceive.CompleteAsync(message.SystemProperties.LockToken);
                }
            }
            catch (BusinessValidationException ex) {
                Console.WriteLine("Busines logic exceptions");
                var userDto = JsonConvert.DeserializeAnonymousType<AppUserDto>(
                    JsonConvert.DeserializeObject(Encoding.UTF8.GetString(message.Body)).ToString(),
                    new AppUserDto()
                );
                message.Body = Encoding.UTF8.GetBytes(
                        JsonConvert.SerializeObject(new { Data = userDto, Errors = ex.Errors })
                    );
                await queueClientToReceive.DeadLetterAsync(message.SystemProperties.LockToken, "Invalid schema", "Invalid schema");
                _logger.LogInformation($"Message is sent to Dead-Letter-Queue: Label: {message.Label}; Body: {Encoding.UTF8.GetString(message.Body)}");
            }
            catch (Exception e) {
                Console.WriteLine(e);
                await queueClientToReceive.AbandonAsync(message.SystemProperties.LockToken);
            } 
        }
    }

}