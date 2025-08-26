using Domain.Entities;
using Shared.Enums;

namespace Aplication.Interfaces.Repository;

public interface IAppointmentRepository : IBaseRepository<Appointment>
{
    Task<IReadOnlyList<Appointment>> GetByDateAsync(DateTime date,Guid companyId);
    Task<IReadOnlyList<Appointment>> GetByCompanyAsync(Guid companyId);
    Task<IReadOnlyList<Appointment>> GetByStatusAsync(StatusOfWork status,Guid companyId);
    Task<IReadOnlyList<Appointment>> GetByClientAsync(Guid clientId);
    Task<IReadOnlyList<Appointment>> GetByServiceAsync(Guid serviceId);
}