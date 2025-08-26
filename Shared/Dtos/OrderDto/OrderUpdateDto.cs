using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.OrderDto;

public class OrderUpdateDto
{
    [Required]
    public Guid Id { get; set; }

    public string? Description { get; set; }
    public Guid? ClientId { get; set; }
}