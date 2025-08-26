using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.AppointmentDto;

public class AppointmentCreateDto
{
    [Required]
    public Guid ClientId { get; set; }

    [Required]
    public Guid ServiceId { get; set; }

    [Required]
    public DateTime DateTime { get; set; }

    public string? Comment { get; set; }
}