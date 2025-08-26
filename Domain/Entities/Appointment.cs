using Domain.Validations.Validators;
using FluentValidation;
using Shared.Enums;

namespace Domain.Entities;
public class Appointment : BaseEntity
{
    public DateTime Date { get; private set; }
    public Guid ClientId { get; private set; }
    public Client Client { get; private set; }

    public Guid ServiceId { get; private set; }
    public Service Service { get; private set; }

    public Guid CompanyId { get; set; }
    public Company Company { get; private set; }

    public DateTime DateTime { get; private set; }
    public string? Comment { get; private set; }
    public StatusOfWork Status { get; private set; } = StatusOfWork.Sheduled;

    private Appointment() { }

    public Appointment(Guid clientId, Guid serviceId, Guid companyId, DateTime dateTime, string? comment = null)
    {
        Date = DateTime.UtcNow;
        ClientId = clientId;
        ServiceId = serviceId;
        CompanyId = companyId;
        DateTime = dateTime;
        Comment = comment;
        Validate();
    }
    
    private void Validate()
    {
        var validator = new AppointmentValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(Appointment)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public void Update(Appointment updated)
    {
        DateTime = updated.DateTime;
        Comment = updated.Comment;
        Validate();
    }

    public void Complete() => Status = StatusOfWork.Done;
    public void Cancel() => Status = StatusOfWork.Canceled;
}