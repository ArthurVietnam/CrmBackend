using System.ComponentModel.DataAnnotations;
using Shared.Enums;

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
    public StatusOfWork Status { get; set; }
}