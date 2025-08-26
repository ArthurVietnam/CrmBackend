using Domain.Validations.Validators;
using FluentValidation;

namespace Domain.Entities;
public class VerificationCode : BaseEntity
{
    public Company Company { get; private set; }
    public Guid CompanyId { get; set; }
    public string Code { get; private set; }
    public DateTime ExpirationTime { get; private set; }

    private VerificationCode() { }

    public VerificationCode(Guid companyId, string code)
    {
        CompanyId = companyId;
        Code = code;
        ExpirationTime = DateTime.UtcNow.AddDays(1);
        Validate();
    }
    
    private void Validate()
    {
        var validator = new VerificationCodeValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(VerificationCode)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public bool IsExpired() => DateTime.UtcNow > ExpirationTime;
}