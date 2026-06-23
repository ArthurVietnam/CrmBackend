using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.AppointmentServiceDto;

public class AppointmentServiceCreateDto
{
    [Required]
    public Guid AppointmentId { get; set; }

    [Required]
    public Guid ServiceId { get; set; }

    [Required]
    [Range(1, uint.MaxValue)]
    public uint Count { get; set; }
}

public class AppointmentServiceUpdateDto
{
    [Required]
    public Guid Id { get; set; }

    [Range(1, uint.MaxValue)]
    public uint? Count { get; set; }
}

public class AppointmentServiceReadDto
{
    public Guid Id { get; init; }
    public Guid AppointmentId { get; init; }
    public Guid? ServiceId { get; init; }
    public uint Count { get; init; }
    public decimal Price { get; init; }
    public decimal TotalPrice { get; init; }
}
