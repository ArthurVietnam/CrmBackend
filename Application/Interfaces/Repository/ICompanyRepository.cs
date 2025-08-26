using Domain.Entities;

namespace Aplication.Interfaces.Repository;

public interface ICompanyRepository : IBaseRepository<Company>
{
    Task<Company?> GetByEmailAsync(string email);
    Task<IReadOnlyList<Company>> GetActiveCompaniesAsync();
    Task<IReadOnlyList<Company>> GetExpiredSubscriptionsAsync();
    Task<bool> DeactivateCompanyAsync(Guid companyId);
    Task<bool> IsSubscriptionActiveAsync(Guid companyId);
}