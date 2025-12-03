using Domain.Validations.Validators;
using FluentValidation;

namespace Domain.Entities;
public class OrderService : BaseEntity
{
    public Order Order { get; private set; }
    public Guid OrderId { get; private set; }
    public Service Service { get; private set; }
    public Guid ServiceId { get; private set; }
    public uint Count { get; private set; }
    public decimal Price { get; private set; }
    public decimal TotalPrice => Count * Price; 

    private OrderService() { }

    public OrderService(Guid orderId, Guid serviceId, uint count, decimal price)
    {
        OrderId = orderId;
        ServiceId = serviceId;
        Count = count;
        Price = price;
        Validate();
    }
    
    private void Validate()
    {
        var validator = new OrderServiceValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(OrderService)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public void Update(OrderService updated)
    {
        Count = updated.Count;
        Price = updated.Price;
        Validate();
    }
}