namespace Shared.Dtos.ClientDto;

public class ClientReadDto
{
    public Guid Id { get; init; }
    public string Name { get; init; }
    public string? Phone { get; init; }
    public string? Email { get; init; }
    public string? Comment { get; init; }
}