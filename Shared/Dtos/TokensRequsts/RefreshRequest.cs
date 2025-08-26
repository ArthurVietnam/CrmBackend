using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.TokensRequsts;

public class RefreshRequest
{
    [Required]
    public string Token { get; set; }
}