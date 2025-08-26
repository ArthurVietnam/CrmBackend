using Domain.Entities;
using Domain.Primitives;
using FluentValidation;

namespace Domain.Validations.Validators;
public class ServiceValidator : AbstractValidator<Service>
{
    public ServiceValidator()
    {
        RuleFor(x => x.ServiceName)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty)
            .Length(0,100).WithMessage(ValidationMessages.WrongLength);
            
        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Цена должна быть больше 0");
    }
}