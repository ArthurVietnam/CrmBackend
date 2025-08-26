using Domain.Validations.Validators;
using FluentValidation;

namespace Domain.Entities;
public class Client : BaseEntity
{
    public string Name { get; private set; }
    public string? Phone { get; private set; }
    public string? Email { get; private set; }
    public string? Comment { get; private set; }
    public Company Company { get; private set; }
    public Guid CompanyId { get; set; }

    public ICollection<Order> Orders { get; } = new List<Order>();
    public ICollection<Appointment> Appointments { get; } = new List<Appointment>();

    private Client() { }

    public Client(string name, Guid companyId, string? phone = null, string? email = null, string? comment = null)
    {
        Name = name;
        CompanyId = companyId;
        Phone = phone;
        Email = email;
        Comment = comment;
        Validate();
    }
    
    private void Validate()
    {
        var validator = new ClientValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(Client)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public void Update(Client updated)
    {
        Name = updated.Name;
        Phone = updated.Phone;
        Email = updated.Email;
        Comment = updated.Comment;
        Validate();
    }
    
}