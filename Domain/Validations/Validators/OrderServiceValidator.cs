using Domain.Entities;
using FluentValidation;

namespace Domain.Validations.Validators;
public class OrderServiceValidator : AbstractValidator<OrderService>
{
    public OrderServiceValidator()
    {
        RuleFor(x => x.Count)
            .GreaterThan((uint)0).WithMessage("Количество должно быть больше 0");
            
        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Цена должна быть больше 0");
    }
}