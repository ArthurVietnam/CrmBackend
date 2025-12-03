using Domain.Validations.Validators;
using FluentValidation;
using Shared.Enums;

namespace Domain.Entities;

public class User : BaseEntity
{
    public string Name { get; private set; }
    public string Email { get; private set; }
    public string? Phone { get; private set; }
    public string Password { get; set; }
    public Company Company { get; private set; }
    public Guid CompanyId { get; private set; }
    public UserRole Role { get; private set; }

    private User()
    {
    }

    public User(string name, string email, string password, Guid companyId, UserRole role = UserRole.Employee)
    {
        Name = name;
        Email = email;
        Password = password;
        CompanyId = companyId;
        Role = role;
        Validate();
    }

    private void Validate()
    {
        var validator = new UserValidator();
        var result = validator.Validate(this);
        if (!result.IsValid)
        {
            throw new ValidationException(
                $"Error occured validation {nameof(User)}:\n" +
                string.Join("\n", result.Errors.Select(e => e.ErrorMessage))
            );
        }
    }

    public void Update(User updated)
    {
        Name = updated.Name;
        Email = updated.Email;
        Phone = updated.Phone;
        Role = updated.Role;
        Validate();
    }

    public bool IsAdmin() => Role == UserRole.Admin;
    public UserRole UpdateRole(UserRole role) => Role = role;
    
    public void UpdateCId(Guid cid)
    {
        CompanyId = cid;
    }
}