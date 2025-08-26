using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using Domain.Entities;
using FluentValidation;

namespace Aplication.Services;

public class VerificationService
{
    private readonly IVerificationCodeRepository _repository;
    private readonly ICompanyRepository _companyRepository;

    public VerificationService(
        IVerificationCodeRepository repository,
        ICompanyRepository companyRepository)
    {
        _repository = repository;
        _companyRepository = companyRepository;
    }

    private async Task<string> GenerateCodeAsync(Guid companyId)
    {
        await _repository.InvalidateOldCodesAsync(companyId);
        
        var company = await _companyRepository.GetByIdAsync(companyId)
        ?? throw new NotFoundException("Company not Found");
        
        var existingCode = await _repository.GetActiveCodeForCompanyAsync(companyId);
        if (existingCode != null && existingCode.ExpirationTime > DateTime.UtcNow)
        {
            return existingCode.Code;
        }

        var code = await EmailService.SendVerificationCodeAsync(company.Email,EmailService.GenerateToken());
        var verificationCode = new VerificationCode(companyId, code);
        
        await _repository.AddAsync(verificationCode);
        return code;
    }

    private async Task<bool> VerifyCodeAsync(Guid companyId, string code)
    {
        var isValid = await _repository.IsValidCodeAsync(companyId, code);
        if (!isValid)
        {
            throw new ValidationException("Invalid verification code.");
        }
        return true;
    }

    public async Task<bool> ResendCodeAsync(Guid companyId)
    {
        var company = await _companyRepository.GetByIdAsync(companyId)
                    ?? throw new NotFoundException("Company not Found");
        
        var code = await GenerateCodeAsync(companyId);
        await EmailService.SendVerificationCodeAsync(company.Email, code);

        return true;
    }

    public async Task<bool> CheckCodeValidityAsync(Guid companyId, string code)
    {
        var company = await _companyRepository.GetByIdAsync(companyId)
                      ?? throw new NotFoundException("Company not found");
        
        if (!await VerifyCodeAsync(companyId, code))
        {
            return false;
        }
        
        company.ExtendSubscriptionByDays(7);
        await _companyRepository.UpdateAsync(company);
        return true;
    }
}
