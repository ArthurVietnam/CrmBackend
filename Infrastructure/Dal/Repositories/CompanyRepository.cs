using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrmPridnestrovye.Dal.Repositories;

public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
{
    public CompanyRepository(ProjectDbContext context) : base(context) { }

    public async Task<Company?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(c => c.Email == email);
    }

    public async Task<IReadOnlyList<Company>> GetActiveCompaniesAsync()
    {
        return await _dbSet
            .Where(c => c.IsActive)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Company>> GetExpiredSubscriptionsAsync()
    {
        var now = DateTime.UtcNow;
        return await _dbSet
            .Where(c => c.SubscriptionEnd < now)
            .ToListAsync();
    }

    public async Task<bool> DeactivateCompanyAsync(Guid companyId)
    {
        var company = await GetByIdAsync(companyId);
        if (company == null) return false;
        
        company.Deactivate();
        await UpdateAsync(company);
        return true;
    }
    
    public async Task<bool> IsSubscriptionActiveAsync(Guid companyId)
    {
        var company = await _dbSet.FirstOrDefaultAsync(c => c.Id == companyId);
        return company?.IsActive ?? false;
    }
}