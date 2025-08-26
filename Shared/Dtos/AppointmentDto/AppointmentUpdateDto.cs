using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.AppointmentDto;

public class AppointmentUpdateDto
{
    [Required]
    public Guid Id { get; set; }

    public DateTime? DateTime { get; set; }
    public string? Comment { get; set; }
}