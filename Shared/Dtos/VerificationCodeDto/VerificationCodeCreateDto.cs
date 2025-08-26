using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.VerificationCodeDto;

public class VerificationCodeCreateDto
{
    [Required]
    [StringLength(6)]
    public string Code { get; set; }
}