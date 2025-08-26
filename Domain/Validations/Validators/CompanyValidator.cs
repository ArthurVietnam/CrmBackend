using Domain.Entities;
using Domain.Primitives;
using FluentValidation;

namespace Domain.Validations.Validators;
public class CompanyValidator : AbstractValidator<Company>
{
    public CompanyValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty)
            .Length(0,50).WithMessage(ValidationMessages.WrongLength);

        RuleFor(x => x.Location)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty)
            .Length(0, 150).WithMessage(ValidationMessages.WrongLength);
            
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty)
            .EmailAddress().WithMessage(ValidationMessages.WrongEmail);
    }
}