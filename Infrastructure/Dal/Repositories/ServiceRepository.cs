using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrmPridnestrovye.Dal.Repositories;

public class ServiceRepository : BaseRepository<Service>, IServiceRepository
{
    public ServiceRepository(ProjectDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Service>> GetByCompanyAsync(Guid companyId)
    {
        return await _dbSet
            .Where(s => s.CompanyId == companyId)
            .Include(s => s.Appointments)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Service>> SearchAsync(string searchTerm,Guid companyId)
    {
        return await _dbSet
            .Where(s => s.ServiceName.Contains(searchTerm) && s.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Service>> GetPopularServicesAsync(int count,Guid companyId)
    {
        return await _dbSet
            .Where(s => s.CompanyId == companyId)
            .OrderByDescending(s => s.Appointments.Count)
            .Take(count)
            .ToListAsync();
    }
}