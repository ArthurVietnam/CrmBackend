using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.Dtos.UserDto;

public class UserCreateDto
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }

    public string? Phone { get; set; }

    public UserRole Role { get; set; } = UserRole.Employee;
}