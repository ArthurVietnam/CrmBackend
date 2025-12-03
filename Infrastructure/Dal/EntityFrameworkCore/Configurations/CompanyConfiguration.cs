using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CrmPridnestrovye.Dal.EntityFrameworkCore.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Location)
            .HasMaxLength(150)
            .IsRequired();
        
        builder.Property(x => x.Name)
            .HasMaxLength(50)
            .IsRequired();
            
        builder.Property(x => x.Email)
            .HasMaxLength(255)
            .IsRequired();

        builder.HasIndex(x => x.Email)
            .IsUnique();
        
        builder.Property(x => x.Password)
            .HasMaxLength(128)
            .IsRequired();
    }
}