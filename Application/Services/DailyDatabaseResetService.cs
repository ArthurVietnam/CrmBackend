using Aplication.Interfaces.Repository;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Aplication.Services;

public class DailyDatabaseResetService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<DailyDatabaseResetService> _logger;

    public DailyDatabaseResetService(IServiceProvider serviceProvider, ILogger<DailyDatabaseResetService> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            var now = DateTime.UtcNow;
            var nextRun = now.Date.AddDays(1);
            var delay = nextRun - now;

            if (delay < TimeSpan.Zero)
            {
                _logger.LogWarning("Computed negative delay ({Delay}), clock may be off. Defaulting to 1 hour", delay);
                delay = TimeSpan.FromHours(1);
            }

            try
            {
                await Task.Delay(delay, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                break;
            }

            await ResetDatabaseAsync(stoppingToken);
        }
    }

    private async Task ResetDatabaseAsync(CancellationToken stoppingToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var resetService = scope.ServiceProvider.GetRequiredService<IDatabaseResetService>();

        _logger.LogInformation("Starting daily database reset");
        await resetService.ResetAsync(stoppingToken);
        _logger.LogInformation("Daily database reset completed");
    }
}