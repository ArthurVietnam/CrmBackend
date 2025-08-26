using Domain.Entities;

namespace Aplication.Interfaces.Repository;

public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetByTokenAsync(string token);
    Task AddAsync(RefreshToken token);
    Task RemoveAsync(string token);
    Task<RefreshToken?> GetByUserIdAsync(Guid userId);

}