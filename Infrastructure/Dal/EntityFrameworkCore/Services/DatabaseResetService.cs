using Aplication.Interfaces.Repository;
using Microsoft.EntityFrameworkCore;

namespace CrmPridnestrovye.Dal.EntityFrameworkCore.Services;

public class DatabaseResetService : IDatabaseResetService
{
    private readonly ProjectDbContext _dbContext;

    public DatabaseResetService(ProjectDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task ResetAsync(CancellationToken cancellationToken)
    {
        await _dbContext.Database.EnsureDeletedAsync(cancellationToken);
        await _dbContext.Database.MigrateAsync(cancellationToken);
    }
}