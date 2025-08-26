using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.ServiceDto;

public class ServiceUpdateDto
{
    [Required]
    public Guid Id { get; set; }

    [MaxLength(100)]
    public string? ServiceName { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal? Price { get; set; }
}