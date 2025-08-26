using Domain.Entities;

namespace Aplication.Interfaces.Repository;

public interface IVerificationCodeRepository : IBaseRepository<VerificationCode>
{
    Task<VerificationCode?> GetActiveCodeForCompanyAsync(Guid companyId);
    Task InvalidateOldCodesAsync(Guid companyId);
    Task<bool> IsValidCodeAsync(Guid companyId, string code);

    Task<bool> HasActiveCodeAsync(Guid companyId);
}