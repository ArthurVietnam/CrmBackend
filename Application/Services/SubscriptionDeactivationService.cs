using Aplication.Interfaces.Repository;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Shared.Dtos.CompanyDto;

namespace Aplication.Services;

public class SubscriptionDeactivationService : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;

    public SubscriptionDeactivationService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var companyService = scope.ServiceProvider.GetRequiredService<CompanyService>();
                var companyReposytory = scope.ServiceProvider.GetRequiredService<ICompanyRepository>();
                await DeactivateExpiredSubscriptionsAsync(companyService,companyReposytory);
            }

            await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
        }
    }

    private async Task DeactivateExpiredSubscriptionsAsync(CompanyService companyService,ICompanyRepository companyRepository)
    {
        var companies = await companyRepository.GetAllAsync();
        var expiredCompanies = companies.Where(c => c.SubscriptionEnd < DateTime.Now && c.IsActive).ToList();

        foreach (var company in expiredCompanies)
        {
            var companyUpdateDto = new CompanyUpdateDto
            {
                IsActive = false
            };

            await companyService.UpdateAsync(companyUpdateDto,company.Id);
        }
    }
}