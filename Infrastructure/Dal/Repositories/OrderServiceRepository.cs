using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Enums;

namespace CrmPridnestrovye.Dal.Repositories;

public class OrderServiceRepository : BaseRepository<OrderService>, IOrderServiceRepository
{
    public OrderServiceRepository(ProjectDbContext context) : base(context) { }

    public async Task<IReadOnlyList<OrderService>> GetByOrderAsync(Guid orderId)
    {
        return await _dbSet
            .Where(os => os.OrderId == orderId)
            .Include(os => os.Service)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<OrderService>> GetByServiceAsync(Guid serviceId)
    {
        return await _dbSet
            .Where(os => os.ServiceId == serviceId)
            .Include(os => os.Order)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalRevenueForServiceAsync(Guid serviceId)
    {
        return await _dbSet
            .Where(os => os.ServiceId == serviceId && os.Order.Status == StatusOfWork.Done)
            .SumAsync(os => os.Count * os.Price);
    }
}