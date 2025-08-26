using Domain.Entities;

namespace Aplication.Interfaces.Repository;

public interface IClientRepository : IBaseRepository<Client>
{
    Task<IReadOnlyList<Client>> SearchAsync(string searchTerm,Guid companyId);
    Task<IReadOnlyList<Client>> GetByCompanyAsync(Guid companyId);
}