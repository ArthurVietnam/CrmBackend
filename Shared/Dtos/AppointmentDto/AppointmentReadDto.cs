using Shared.Enums;

namespace Shared.Dtos.AppointmentDto;

public class AppointmentReadDto
{
    public Guid Id { get; init; }
    public Guid ClientId { get; init; }
    public Guid ServiceId { get; init; }
    public DateTime DateTime { get; init; }
    public string? Comment { get; init; }
    public StatusOfWork Status { get; init; }
}