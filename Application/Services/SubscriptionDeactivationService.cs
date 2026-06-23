using Aplication.Interfaces.Repository;
using Aplication.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Dtos.CompanyDto;

namespace Application.Services;

public class SubscriptionDeactivationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public delegate void CompanyDeactivatedHandler(Guid companyId, string companyName);

    public event CompanyDeactivatedHandler? OnCompanyDeactivated;

    public SubscriptionDeactivationService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        OnCompanyDeactivated += LogDeactivation;

        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var companyService = scope.ServiceProvider.GetRequiredService<CompanyService>();
                var companyRepository = scope.ServiceProvider.GetRequiredService<ICompanyRepository>();
                await DeactivateExpiredSubscriptionsAsync(companyService, companyRepository);
            }

            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }

    private async Task DeactivateExpiredSubscriptionsAsync(
        CompanyService companyService,
        ICompanyRepository companyRepository)
    {
        var companies = await companyRepository.GetAllAsync();
        var expiredCompanies = companies
            .Where(c => c.SubscriptionEnd < DateTime.Now && c.IsActive)
            .ToList();

        foreach (var company in expiredCompanies)
        {
            var companyUpdateDto = new CompanyUpdateDto
            {
                IsActive = false
            };

            await companyService.UpdateAsync(companyUpdateDto, company.Id);

            OnCompanyDeactivated?.Invoke(company.Id, company.Name);
        }
    }

    private void LogDeactivation(Guid companyId, string companyName)
    {
        Console.WriteLine($"[{DateTime.Now:u}] Company deactivate: {companyName} (Id={companyId})");
    }
}