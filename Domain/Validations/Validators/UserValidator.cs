using Domain.Entities;
using Domain.Primitives;
using FluentValidation;

namespace Domain.Validations.Validators;
public class UserValidator : AbstractValidator<User>
{
    public UserValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty)
            .Length(0,50).WithMessage(ValidationMessages.WrongLength);
            
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty)
            .EmailAddress().WithMessage(ValidationMessages.WrongEmail);
    }
}