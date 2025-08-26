using Shared.Enums;

namespace Shared.Dtos.UserDto;

public class UserReadDto
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public string Email { get; init; }
    public string? Phone { get; init; }
    public UserRole Role { get; init; }

}