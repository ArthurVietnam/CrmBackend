using Domain.Entities;

namespace Aplication.Interfaces.Repository;

public interface IOrderServiceRepository : IBaseRepository<OrderService>
{
    Task<IReadOnlyList<OrderService>> GetByOrderAsync(Guid orderId);
    Task<IReadOnlyList<OrderService>> GetByServiceAsync(Guid serviceId);
    Task<decimal> GetTotalRevenueForServiceAsync(Guid serviceId);
}