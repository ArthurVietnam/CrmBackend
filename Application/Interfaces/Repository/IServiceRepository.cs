using Domain.Entities;

namespace Aplication.Interfaces.Repository;

public interface IServiceRepository : IBaseRepository<Service>
{
    Task<IReadOnlyList<Service>> GetByCompanyAsync(Guid companyId);
    Task<IReadOnlyList<Service>> SearchAsync(string searchTerm,Guid companyId);
    Task<IReadOnlyList<Service>> GetPopularServicesAsync(int count,Guid companyId);
}