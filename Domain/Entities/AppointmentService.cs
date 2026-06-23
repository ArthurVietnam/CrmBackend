using Domain.Validations.Validators;
using FluentValidation;

namespace Domain.Entities;

public class AppointmentService : BaseEntity
{
    public Appointment Appointment { get; private set; }
    public Guid AppointmentId { get; private set; }
    public Service? Service { get; private set; }
    public Guid? ServiceId { get; private set; }
    public uint Count { get; private set; }
    public decimal Price { get; private set; }
    public decimal TotalPrice => Count * Price;

    private AppointmentService() { }

    public AppointmentService(Guid appointmentId, Guid serviceId, uint count, decimal price)
    {
        AppointmentId = appointmentId;
        ServiceId = serviceId;
        Count = count;
        Price = price;
        Validate();
    }

    private void Validate()
    {
        var validator = new AppointmentServiceValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(AppointmentService)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public void Update(AppointmentService updated)
    {
        Count = updated.Count;
        Price = updated.Price;
        Validate();
    }
}
