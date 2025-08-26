using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Enums;

namespace CrmPridnestrovye.Dal.Repositories;

public class OrderRepository : BaseRepository<Order>, IOrderRepository
{
    public OrderRepository(ProjectDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Order>> GetByCompanyAsync(Guid companyId)
    {
        return await _dbSet
            .Where(o => o.CompanyId == companyId)
            .Include(o => o.OrderServices)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Order>> GetByStatusAsync(StatusOfWork status,Guid companyId)
    {
        return await _dbSet
            .Where(o => o.Status == status && o.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Order>> GetByClientAsync(Guid clientId)
    {
        return await _dbSet
            .Where(o => o.ClientId == clientId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Order>> GetOrdersByDateRangeAsync(DateTime start, DateTime end,Guid companyId)
    {
        return await _dbSet
            .Where(o => (o.Date >= start && o.Date <= end) && o.CompanyId == companyId)
            .ToListAsync();
    }
}