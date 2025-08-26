using Domain.Entities;
using Domain.Primitives;
using FluentValidation;

namespace Domain.Validations.Validators;
public class AppointmentValidator : AbstractValidator<Appointment>
{
    public AppointmentValidator()
    {
        RuleFor(x => x.ClientId)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty);
            
        RuleFor(x => x.ServiceId)
            .NotEmpty().WithMessage(ValidationMessages.NotEmpty);
        
        RuleFor(x => x.Date)
            .LessThanOrEqualTo(DateTime.UtcNow)
            .WithMessage(ValidationMessages.WrongTime);
            
        RuleFor(x => x.DateTime)
            .GreaterThan(DateTime.UtcNow.AddMinutes(-5))
            .WithMessage(ValidationMessages.WrongTime);
    }
}