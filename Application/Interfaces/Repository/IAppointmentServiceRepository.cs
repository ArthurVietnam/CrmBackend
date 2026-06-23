using Domain.Entities;

namespace Aplication.Interfaces.Repository;

public interface IAppointmentServiceRepository : IBaseRepository<AppointmentService>
{
    Task<IReadOnlyList<AppointmentService>> GetByAppointmentAsync(Guid appointmentId);
    Task<IReadOnlyList<AppointmentService>> GetByServiceAsync(Guid serviceId);
    Task<decimal> GetTotalRevenueForServiceAsync(Guid serviceId);
}
