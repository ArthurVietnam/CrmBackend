using Shared.Enums;

namespace Shared.Dtos.CompanyDto;

public class CompanyReadDto
{
    public string Name { get; init; }
    public string Location { get; init; }
    public string Password { get; init; }
    public string Email { get; init; }
    public bool IsActive { get; init; }
    public Subscribes Subscribe { get; init; }
    public DateTime SubscriptionEnd { get; init; }
}