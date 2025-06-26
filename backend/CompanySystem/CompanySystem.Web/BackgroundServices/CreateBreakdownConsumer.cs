using System.Text;
using System.Text.Json;
using CompanySystem.Application.Abstarctions;
using CompanySystem.Application.Abstractions;
using CompanySystem.Application.Models.Breakdowns;
using CompanySystem.Domain.Options;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace CompanySystem.Web.BackgroundServices
{
    public class CreateBreakdownConsumer : BackgroundService
    {
        private readonly RabbitMqOptions _rabbitMqOptions;
        private readonly IChannel _channel;
        private readonly IServiceProvider _serviceProvider;

        public CreateBreakdownConsumer(IOptions<RabbitMqOptions> options, IServiceProvider serviceProvider)
        {
            _rabbitMqOptions = options.Value;
            _serviceProvider = serviceProvider;
            var factory = new ConnectionFactory
            {
                HostName = _rabbitMqOptions.HostName,
                Port = _rabbitMqOptions.Port,
                UserName = _rabbitMqOptions.UserName,
                Password = _rabbitMqOptions.Password,
                VirtualHost = _rabbitMqOptions.VirtualHost
            };
            var connection = factory.CreateConnectionAsync().GetAwaiter().GetResult();
            _channel = connection.CreateChannelAsync().GetAwaiter().GetResult();
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();

            var consumer = new AsyncEventingBasicConsumer(_channel);

            consumer.ReceivedAsync += async (_, ea) =>
            {
                var body = ea.Body;
                var message = Encoding.UTF8.GetString(body.ToArray());
                try
                {
                    var createBreakdownDto = JsonSerializer.Deserialize<CreateBreakdownByAdminDto>(message, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    })!;
                    using var scope = _serviceProvider.CreateScope();
                    var ordersService = scope.ServiceProvider.GetRequiredService<IBreakdownService>();

                    await ordersService.CreateByAdminAsync(createBreakdownDto);

                    await _channel.BasicAckAsync(ea.DeliveryTag, false, stoppingToken);
                }
                catch (Exception)
                {
                    await _channel.BasicAckAsync(ea.DeliveryTag, false, stoppingToken);
                }
            };

            await _channel.BasicConsumeAsync(_rabbitMqOptions.CreateBreakdownQueueName, autoAck: false, consumer, cancellationToken: stoppingToken);
        }
    }
}
