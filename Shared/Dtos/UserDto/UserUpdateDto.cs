using System.ComponentModel.DataAnnotations;
using Shared.Enums;

namespace Shared.Dtos.UserDto;

public class UserUpdateDto
{
    [Required]
    public Guid Id { get; set; }

    [MaxLength(50)]
    public string? Name { get; set; }

    [EmailAddress]
    public string? Email { get; set; }

    public string? Phone { get; set; }
    public UserRole? Role { get; set; }
}