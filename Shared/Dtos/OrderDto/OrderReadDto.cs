using Shared.Enums;

namespace Shared.Dtos.OrderDto;

public class OrderReadDto
{
    public Guid Id { get; init; }
    public DateTime Date { get; init; }
    public string? Description { get; init; }
    public decimal Sum { get; init; }
    public StatusOfWork Status { get; init; }
    public Guid ClientId { get; init; }
}