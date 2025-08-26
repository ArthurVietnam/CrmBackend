using CrmPridnestrovye.Dal.EntityFrameworkCore.Configurations;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrmPridnestrovye.Dal.EntityFrameworkCore;

public class ProjectDbContext : DbContext
{
    public DbSet<TEntity> Set<TEntity>() where TEntity : BaseEntity 
        =>  base.Set<TEntity>();
    
    public DbSet<Order> Orders { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Service> Services { get; set; }
    public DbSet<OrderService> OrderServices { get; set; }
    
    public ProjectDbContext(DbContextOptions<ProjectDbContext> options) :
        base(options)
    {
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    
        modelBuilder.ApplyConfiguration(new AppointmentConfiguration());
        modelBuilder.ApplyConfiguration(new ClientConfiguration());
        modelBuilder.ApplyConfiguration(new CompanyConfiguration());
        modelBuilder.ApplyConfiguration(new OrderConfiguration());
        modelBuilder.ApplyConfiguration(new OrderServiceConfiguration());
        modelBuilder.ApplyConfiguration(new ServiceConfiguration());
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new VerificationCodeConfiguration());
        modelBuilder.ApplyConfiguration(new RefreshTokenConfiguration());

    }
}