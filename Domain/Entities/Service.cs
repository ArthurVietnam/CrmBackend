using Domain.Validations.Validators;
using FluentValidation;

namespace Domain.Entities;
public class Service : BaseEntity
{
    public string ServiceName { get; private set; }
    public decimal Price { get; private set; }
    public Company Company { get; private set; }
    public Guid CompanyId { get; private set; }
    
    public ICollection<Appointment> Appointments { get; } = new List<Appointment>();

    private Service() { }

    public Service(string serviceName, decimal price, Guid companyId)
    {
        ServiceName = serviceName;
        Price = price;
        CompanyId = companyId;
        Validate();
    }
    
    private void Validate()
    {
        var validator = new ServiceValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(Service)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public void Update(Service updated)
    {
        ServiceName = updated.ServiceName;
        Price = updated.Price;
        Validate();
    }

    public void UpdateCId(Guid cid)
    {
        CompanyId = cid;
    }
}