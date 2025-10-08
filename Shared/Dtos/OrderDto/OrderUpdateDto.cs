using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.OrderDto;

public class OrderUpdateDto
{
    public string? Description { get; set; }
    public Guid? ClientId { get; set; }
}