using Domain.Entities;
using Shared.Enums;

namespace Aplication.Interfaces.Repository;

public interface IUserRepository : IBaseRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<IReadOnlyList<User>> GetByRoleAsync(UserRole role,Guid companyId);
    Task<IReadOnlyList<User>> GetByCompanyAsync(Guid companyId);
    Task<bool> IsEmailUniqueAsync(string email,Guid companyId);
    Task<Guid> GetIdByEmail(string email);
}