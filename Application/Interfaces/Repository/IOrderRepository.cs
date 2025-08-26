using Domain.Entities;
using Shared.Enums;

namespace Aplication.Interfaces.Repository;

public interface IOrderRepository : IBaseRepository<Order>
{
    Task<IReadOnlyList<Order>> GetByCompanyAsync(Guid companyId);
    Task<IReadOnlyList<Order>> GetByStatusAsync(StatusOfWork status,Guid companyId);
    Task<IReadOnlyList<Order>> GetByClientAsync(Guid clientId);
    Task<IReadOnlyList<Order>> GetOrdersByDateRangeAsync(DateTime start, DateTime end,Guid companyId);
}