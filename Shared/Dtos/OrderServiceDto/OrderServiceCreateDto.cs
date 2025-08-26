using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.OrderServiceDto;

public class OrderServiceCreateDto
{
    [Required]
    public Guid OrderId { get; set; }

    [Required]
    public Guid ServiceId { get; set; }

    [Required]
    [Range(1, uint.MaxValue)]
    public uint Count { get; set; }
}