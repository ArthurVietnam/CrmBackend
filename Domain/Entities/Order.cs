using Domain.Validations.Validators;
using FluentValidation;
using Shared.Enums;

namespace Domain.Entities;
public class Order : BaseEntity
{
    public DateTime Date { get; private set; }
    public string? Description { get; private set; }
    public decimal Sum => OrderServices.Sum(os => os.TotalPrice);
    public StatusOfWork Status { get; private set; } = StatusOfWork.InProgress;
    public Client? Client { get; private set; }
    public Guid? ClientId { get; private set; }
    public Company Company { get; private set; }
    public Guid CompanyId { get; set; }

    public ICollection<OrderService> OrderServices { get; } = new List<OrderService>();

    private Order() { }

    public Order(Guid companyId, string? description = null, Guid? clientId = null)
    {
        Date = DateTime.UtcNow;
        CompanyId = companyId;
        Description = description;
        ClientId = clientId;
        Validate();
    }
    
    private void Validate()
    {
        var validator = new OrderValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(Order)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public void Update(Order updated)
    {
        Description = updated.Description;
        ClientId = updated.ClientId;
        Validate();
    }

    public void Complete() => Status = StatusOfWork.Done;
    public void Cancel() => Status = StatusOfWork.Canceled;
}