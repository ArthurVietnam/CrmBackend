using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.ServiceDto;

public class ServiceCreateDto
{
    [Required]
    [MaxLength(100)]
    public string ServiceName { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }
}