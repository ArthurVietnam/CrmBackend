using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrmPridnestrovye.Dal.Repositories;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly ProjectDbContext _context;
    private readonly DbSet<RefreshToken> _dbSet;

    public RefreshTokenRepository(ProjectDbContext context)
    {
        _context = context;
        _dbSet = context.Set<RefreshToken>();
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        return await _dbSet.FirstOrDefaultAsync(rt => rt.Token == token);
    }

    public async Task AddAsync(RefreshToken token)
    {
        await _dbSet.AddAsync(token);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveAsync(string token)
    {
        var refresh = await _dbSet.FirstOrDefaultAsync(rt => rt.Token == token)
            ?? throw new NotFoundException("Token not found");
        _dbSet.Remove(refresh);
        await _context.SaveChangesAsync();
    }
    
    public async Task<RefreshToken?> GetByUserIdAsync(Guid userId)
    {
        return await _dbSet.FirstOrDefaultAsync(rt => rt.UserId == userId);
    }

}
