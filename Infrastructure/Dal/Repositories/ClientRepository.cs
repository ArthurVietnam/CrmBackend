using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrmPridnestrovye.Dal.Repositories;

public class ClientRepository : BaseRepository<Client>, IClientRepository
{
    public ClientRepository(ProjectDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Client>> SearchAsync(string searchTerm,Guid companyId)
    {
        return await _dbSet
            .Where(c => (c.Name.Contains(searchTerm)
                         || c.Phone.Contains(searchTerm)
                         || c.Email.Contains(searchTerm)) 
                        && c.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Client>> GetByCompanyAsync(Guid companyId)
    {
        return await _dbSet
            .Where(c => c.CompanyId == companyId)
            .ToListAsync();
    }
}
