using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.ClientDto;

public class ClientCreateDto
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    public string? Phone { get; set; }
    public string? Email { get; set; }
    public string? Comment { get; set; }
}