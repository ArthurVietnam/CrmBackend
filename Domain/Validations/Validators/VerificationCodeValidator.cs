using Domain.Entities;
using Domain.Primitives;
using FluentValidation;

namespace Domain.Validations.Validators;
public class VerificationCodeValidator : AbstractValidator<VerificationCode>
{
    public VerificationCodeValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty)
            .Length(6).WithMessage("Код должен содержать 6 символов")
            .Matches("^[0-9]*$").WithMessage("Код должен содержать только цифры");
    }
}