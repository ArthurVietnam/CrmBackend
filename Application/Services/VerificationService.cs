using Aplication.Exceptions;
using Aplication.Interfaces.Repository;
using Domain.Entities;
using FluentValidation;

namespace Aplication.Services;

public class VerificationService
{
    private readonly IVerificationCodeRepository _repository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IEmailService _emailService;

    public VerificationService(
        IVerificationCodeRepository repository,
        ICompanyRepository companyRepository,
        IEmailService emailService)
    {
        _repository = repository;
        _companyRepository = companyRepository;
        _emailService = emailService;
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

        var code = _emailService.GenerateToken();
        await _emailService.SendVerificationCodeAsync(company.Email, code);

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
        _ = await _companyRepository.GetByIdAsync(companyId)
                    ?? throw new NotFoundException("Company not Found");

        await GenerateCodeAsync(companyId);

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