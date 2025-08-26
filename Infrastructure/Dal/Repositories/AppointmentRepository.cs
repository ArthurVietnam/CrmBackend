using Aplication.Interfaces.Repository;
using CrmPridnestrovye.Dal.EntityFrameworkCore;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Shared.Enums;

namespace CrmPridnestrovye.Dal.Repositories;

public class AppointmentRepository : BaseRepository<Appointment>, IAppointmentRepository
{
    public AppointmentRepository(ProjectDbContext context) : base(context) { }

    public async Task<IReadOnlyList<Appointment>> GetByDateAsync(DateTime date,Guid companyId)
    {
        return await _dbSet
            .Where(a => a.DateTime.Date == date.Date && a.CompanyId == companyId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Appointment>> GetByStatusAsync(StatusOfWork status,Guid companyId)
    {
        return await _dbSet
            .Where(a => a.Status == status && a.CompanyId == companyId)
            .ToListAsync();
    }
    public async Task<IReadOnlyList<Appointment>> GetByCompanyAsync(Guid companyId)
    {
        return await _dbSet
            .Where(c => c.CompanyId == companyId)
            .ToListAsync();
    }
    public async Task<IReadOnlyList<Appointment>> GetByClientAsync(Guid clientId)
    {
        return await _dbSet
            .Where(a => a.ClientId == clientId)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Appointment>> GetByServiceAsync(Guid serviceId)
    {
        return await _dbSet
            .Where(a => a.ServiceId == serviceId)
            .ToListAsync();
    }
}