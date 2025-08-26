using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrmPridnestrovye.Dal.Repositories;

public class VerificationCodeRepository : BaseRepository<VerificationCode>, IVerificationCodeRepository
{
    public VerificationCodeRepository(ProjectDbContext context) : base(context) { }

    public async Task<VerificationCode?> GetActiveCodeForCompanyAsync(Guid companyId)
    {
        return await _dbSet
            .Where(vc => vc.CompanyId == companyId && 
                         vc.ExpirationTime > DateTime.UtcNow)
            .OrderByDescending(vc => vc.ExpirationTime)
            .FirstOrDefaultAsync();
    }

    public async Task InvalidateOldCodesAsync(Guid companyId)
    {
        var codes = await _dbSet
            .Where(vc => vc.CompanyId == companyId)
            .ToListAsync();

        _dbSet.RemoveRange(codes);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IsValidCodeAsync(Guid companyId, string code)
    {
        return await _dbSet
            .AnyAsync(vc => vc.CompanyId == companyId && 
                            vc.Code == code && 
                            vc.ExpirationTime > DateTime.UtcNow);
    }
    
    public async Task<bool> HasActiveCodeAsync(Guid companyId)
    {
        return await _dbSet
            .AnyAsync(vc => vc.CompanyId == companyId && vc.ExpirationTime > DateTime.UtcNow);
    }
}