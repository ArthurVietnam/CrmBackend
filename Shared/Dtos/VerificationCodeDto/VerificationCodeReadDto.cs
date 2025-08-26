namespace Shared.Dtos.VerificationCodeDto;

public class VerificationCodeReadDto
{
    public Guid Id { get; init; }
    public string Code { get; init; }
    public DateTime ExpirationTime { get; init; }
}