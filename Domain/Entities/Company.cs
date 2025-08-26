using Domain.Validations.Validators;
using FluentValidation;
using Shared.Enums;

namespace Domain.Entities;
public class Company : BaseEntity
{
    public string Name { get; private set; }
    public string Location { get; private set; }
    public bool IsActive { get; private set; } = false;
    public string Email { get; private set; }
    public string Password { get; private set; }
    public Subscribes Subscribe { get; private set; }
    public DateTime SubscriptionEnd { get; private set; }
    
    public ICollection<User> Users { get; } = new List<User>();
    public ICollection<Client> Clients { get; } = new List<Client>();
    public ICollection<Service> Services { get; } = new List<Service>();
    public ICollection<Order> Orders { get; } = new List<Order>();
    public ICollection<Appointment> Appointments { get; } = new List<Appointment>();
    public ICollection<OrderService> OrderServices { get; } = new List<OrderService>();

    private Company() { }

    public Company(string name, string location, string email, string password)
    {
        Name = name;
        Location = location;
        Email = email;
        Password = password;
        SubscriptionEnd = DateTime.UtcNow;
        Validate();
    }
    
    private void Validate()
    {
        var validator = new CompanyValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(Company)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public void Update(Company updated)
    {
        Name = updated.Name;
        Location = updated.Location;
        Email = updated.Email;
        Validate();
    }

    public void ExtendSubscriptionByMonths(int months,Subscribes subscribe)
    {
        var start = SubscriptionEnd > DateTime.UtcNow ? SubscriptionEnd : DateTime.UtcNow;
        Subscribe = subscribe;
        Activate();
        SubscriptionEnd = start.AddMonths(months);
    }
    
    public void ExtendSubscriptionByDays(int days)
    {
        var start = SubscriptionEnd > DateTime.UtcNow ? SubscriptionEnd : DateTime.UtcNow;
        Activate();
        SubscriptionEnd = start.AddDays(days);
    }

    public void Deactivate() => IsActive = false;
    public void Activate() => IsActive = true;
}