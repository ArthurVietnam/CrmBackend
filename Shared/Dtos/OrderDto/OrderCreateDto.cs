namespace Shared.Dtos.OrderDto;

public class OrderCreateDto
{
    public string? Description { get; set; }

    public Guid? ClientId { get; set; }
}