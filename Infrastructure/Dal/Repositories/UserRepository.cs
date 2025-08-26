using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Enums;

namespace CrmPridnestrovye.Dal.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(ProjectDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<IReadOnlyList<User>> GetByRoleAsync(UserRole role,Guid companyId)
    {
        return await _dbSet
            .Where(u => u.Role == role && u.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<User>> GetByCompanyAsync(Guid companyId)
    {
        return await _dbSet
            .Where(u => u.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task<bool> IsEmailUniqueAsync(string email,Guid companyId)
    {
        return !await _dbSet.AnyAsync(u => u.Email == email && u.CompanyId == companyId);
    }

    public async Task<Guid> GetIdByEmail(string email)
    {
        var user = await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
        return user.CompanyId;
    }
}