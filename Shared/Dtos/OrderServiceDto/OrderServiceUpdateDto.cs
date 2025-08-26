using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.OrderServiceDto;

public class OrderServiceUpdateDto
{
    [Required]
    public Guid Id { get; set; }

    [Range(1, uint.MaxValue)]
    public uint? Count { get; set; }
}