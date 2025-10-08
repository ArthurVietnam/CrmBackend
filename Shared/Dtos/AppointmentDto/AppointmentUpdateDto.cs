using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.AppointmentDto;

public class AppointmentUpdateDto
{
    public DateTime? DateTime { get; set; }
    public string? Comment { get; set; }
}