using System.ComponentModel.DataAnnotations;

namespace Shared.Dtos.CompanyDto;

public class CompanyUpdateDto
{
    [MaxLength(50)]
    public string? Name { get; set; }
    
    [MaxLength(150)]
    public string? Location { get; set; }

    [EmailAddress]
    public string? Email { get; set; }
    
    public bool? IsActive { get; set; }
}