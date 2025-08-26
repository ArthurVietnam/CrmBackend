namespace Shared.Dtos.OrderServiceDto;

public class OrderServiceReadDto
{
    public Guid Id { get; init; }
    public uint Count { get; init; }
    public decimal Price { get; init; }
    public decimal TotalPrice { get; init; }
}