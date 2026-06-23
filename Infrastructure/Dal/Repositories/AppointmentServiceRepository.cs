using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Enums;

namespace CrmPridnestrovye.Dal.Repositories;

public class AppointmentServiceRepository : BaseRepository<AppointmentService>, IAppointmentServiceRepository
{
    public AppointmentServiceRepository(ProjectDbContext context) : base(context) { }

    public async Task<IReadOnlyList<AppointmentService>> GetByAppointmentAsync(Guid appointmentId)
    {
        return await _dbSet
            .Where(s => s.AppointmentId == appointmentId)
            .Include(s => s.Service)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<AppointmentService>> GetByServiceAsync(Guid serviceId)
    {
        return await _dbSet
            .Where(s => s.ServiceId == serviceId)
            .Include(s => s.Appointment)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalRevenueForServiceAsync(Guid serviceId)
    {
        return await _dbSet
            .Where(s => s.ServiceId == serviceId && s.Appointment.Status == StatusOfWork.Done)
            .SumAsync(s => s.Count * s.Price);
    }
}
