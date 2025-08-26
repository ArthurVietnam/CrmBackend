namespace Shared.Dtos.ServiceDto;

public class ServiceReadDto
{
    public Guid Id { get; init; }
    public string ServiceName { get; init; }
    public decimal Price { get; init; }
}