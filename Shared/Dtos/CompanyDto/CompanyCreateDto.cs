using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.CompanyDto;

public class CompanyCreateDto
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }
    
    [Required]
    [MaxLength(150)]
    public string Location { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Required]
    public string Password { get; set; }
}