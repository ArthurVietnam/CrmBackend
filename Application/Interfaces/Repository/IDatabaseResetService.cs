namespace Aplication.Interfaces.Repository;

public interface IDatabaseResetService
{
    Task ResetAsync(CancellationToken cancellationToken);
}